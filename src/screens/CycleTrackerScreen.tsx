import React, { useState, useMemo } from "react";
import { View, Text, ScrollView, Pressable, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";
import { useCycleStore } from "../state/store";
import { useTheme } from "../hooks/useTheme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const DAY_SIZE = (SCREEN_WIDTH - 64) / 7;

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
const MONTHS = [
  "Janeiro", "Fevereiro", "Marco", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

interface DayInfo {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isPeriod: boolean;
  isOvulation: boolean;
  isFertile: boolean;
  isPredictedPeriod: boolean;
  isToday: boolean;
}

export default function CycleTrackerScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const lastPeriodStart = useCycleStore((s) => s.lastPeriodStart);
  const cycleLength = useCycleStore((s) => s.cycleLength);
  const periodLength = useCycleStore((s) => s.periodLength);
  const setLastPeriodStart = useCycleStore((s) => s.setLastPeriodStart);

  const today = useMemo(() => new Date(), []);

  const cycleInfo = useMemo(() => {
    if (!lastPeriodStart) return null;

    const start = new Date(lastPeriodStart);
    const now = new Date();
    const daysSincePeriod = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const currentCycleDay = (daysSincePeriod % cycleLength) + 1;

    const ovulationDay = cycleLength - 14;
    const fertileStart = ovulationDay - 5;
    const fertileEnd = ovulationDay + 1;

    const nextPeriodDate = new Date(start);
    nextPeriodDate.setDate(start.getDate() + cycleLength * Math.ceil(daysSincePeriod / cycleLength));

    const daysUntilPeriod = Math.max(0, Math.floor((nextPeriodDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

    const isInPeriod = currentCycleDay <= periodLength;
    const isInFertileWindow = currentCycleDay >= fertileStart && currentCycleDay <= fertileEnd;
    const isOvulationDay = currentCycleDay === ovulationDay;

    let phase = "Folicular";
    let phaseDescription = "Seu corpo esta se preparando para a ovulacao";
    let phaseColor = "#F472B6";

    if (isInPeriod) {
      phase = "Menstruacao";
      phaseDescription = "Periodo menstrual";
      phaseColor = "#E11D48";
    } else if (isOvulationDay) {
      phase = "Ovulacao";
      phaseDescription = "Dia mais fertil do ciclo";
      phaseColor = "#8B5CF6";
    } else if (isInFertileWindow) {
      phase = "Janela Fertil";
      phaseDescription = "Alta chance de concepcao";
      phaseColor = "#A855F7";
    } else if (currentCycleDay > ovulationDay) {
      phase = "Lutea";
      phaseDescription = "Corpo se preparando para o proximo ciclo";
      phaseColor = "#EC4899";
    }

    return {
      currentCycleDay,
      daysUntilPeriod,
      phase,
      phaseDescription,
      phaseColor,
      isInPeriod,
      isInFertileWindow,
      isOvulationDay,
      ovulationDay,
      fertileStart,
      fertileEnd,
    };
  }, [lastPeriodStart, cycleLength, periodLength]);

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days: DayInfo[] = [];

    // Previous month days
    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthDays - i);
      days.push(createDayInfo(date, false));
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push(createDayInfo(date, true));
    }

    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push(createDayInfo(date, false));
    }

    return days;
  }, [currentMonth, lastPeriodStart, cycleLength, periodLength]);

  function createDayInfo(date: Date, isCurrentMonth: boolean): DayInfo {
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    let isPeriod = false;
    let isOvulation = false;
    let isFertile = false;
    let isPredictedPeriod = false;

    if (lastPeriodStart) {
      const start = new Date(lastPeriodStart);
      const daysSinceStart = Math.floor((date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

      if (daysSinceStart >= 0) {
        const cycleDay = (daysSinceStart % cycleLength) + 1;
        const ovulationDay = cycleLength - 14;
        const fertileStart = ovulationDay - 5;
        const fertileEnd = ovulationDay + 1;

        isPeriod = cycleDay <= periodLength && daysSinceStart < cycleLength;
        isPredictedPeriod = cycleDay <= periodLength && daysSinceStart >= cycleLength;
        isOvulation = cycleDay === ovulationDay;
        isFertile = cycleDay >= fertileStart && cycleDay <= fertileEnd && !isOvulation;
      }
    }

    return {
      date,
      day: date.getDate(),
      isCurrentMonth,
      isPeriod,
      isOvulation,
      isFertile,
      isPredictedPeriod,
      isToday,
    };
  }

  const goToPrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDayPress = (dayInfo: DayInfo) => {
    setSelectedDate(dayInfo.date);
  };

  const handleLogPeriod = () => {
    const dateToLog = selectedDate || new Date();
    setLastPeriodStart(dateToLog.toISOString());
    setSelectedDate(null);
  };

  const renderDay = (dayInfo: DayInfo, index: number) => {
    const isSelected =
      selectedDate &&
      dayInfo.date.getDate() === selectedDate.getDate() &&
      dayInfo.date.getMonth() === selectedDate.getMonth() &&
      dayInfo.date.getFullYear() === selectedDate.getFullYear();

    let bgColor: string = "transparent";
    let textColor: string = dayInfo.isCurrentMonth ? colors.neutral[700] : colors.neutral[300];
    let borderColor: string = "transparent";

    if (dayInfo.isPeriod) {
      bgColor = colors.primary[100];
      textColor = colors.primary[500];
    } else if (dayInfo.isPredictedPeriod) {
      bgColor = colors.primary[50];
      textColor = colors.primary[400];
      borderColor = colors.primary[200];
    } else if (dayInfo.isOvulation) {
      bgColor = colors.secondary[100];
      textColor = colors.secondary[600];
    } else if (dayInfo.isFertile) {
      bgColor = colors.secondary[50];
      textColor = colors.secondary[500];
    }

    if (dayInfo.isToday) {
      borderColor = colors.primary[500];
    }

    if (isSelected) {
      borderColor = colors.neutral[700];
    }

    return (
      <Pressable
        key={index}
        onPress={() => handleDayPress(dayInfo)}
        style={{
          width: DAY_SIZE,
          height: DAY_SIZE,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: DAY_SIZE - 8,
            height: DAY_SIZE - 8,
            borderRadius: (DAY_SIZE - 8) / 2,
            backgroundColor: bgColor,
            borderWidth: borderColor !== "transparent" ? 2 : 0,
            borderColor: borderColor,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: dayInfo.isToday || isSelected ? "600" : "400",
              color: textColor,
            }}
          >
            {dayInfo.day}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background.secondary }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Header */}
        <View style={{ paddingTop: insets.top }}>
          <LinearGradient
            colors={[colors.primary[50], colors.secondary[50], colors.background.secondary]}
            locations={[0, 0.5, 1]}
            style={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 24 }}
          >
            <Animated.View entering={FadeInDown.duration(600).springify()}>
              <Text className="text-warmGray-900 text-3xl font-serif mb-2">
                Ciclo Menstrual
              </Text>
              <Text className="text-warmGray-500 text-base">
                Acompanhe seu ciclo e fertilidade
              </Text>
            </Animated.View>
          </LinearGradient>
        </View>

        {/* Cycle Status Card */}
        {cycleInfo && (
          <Animated.View
            entering={FadeInUp.delay(100).duration(600).springify()}
            className="mx-6 mb-6"
          >
            <View
              className="rounded-3xl overflow-hidden"
              style={{
                shadowColor: cycleInfo.phaseColor,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.25,
                shadowRadius: 16,
              }}
            >
              <LinearGradient
                colors={[cycleInfo.phaseColor, `${cycleInfo.phaseColor}DD`]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ padding: 24 }}
              >
                <View className="flex-row items-center justify-between mb-4">
                  <View>
                    <Text className="text-white/70 text-sm font-medium uppercase tracking-wider">
                      Fase Atual
                    </Text>
                    <Text className="text-white text-2xl font-bold mt-1">
                      {cycleInfo.phase}
                    </Text>
                  </View>
                  <View
                    className="w-16 h-16 rounded-full items-center justify-center"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                  >
                    <Text className="text-white text-2xl font-bold">
                      {cycleInfo.currentCycleDay}
                    </Text>
                    <Text className="text-white/70 text-xs">dia</Text>
                  </View>
                </View>

                <Text className="text-white/90 text-base mb-4">
                  {cycleInfo.phaseDescription}
                </Text>

                <View className="flex-row justify-between">
                  <View className="flex-1 mr-4">
                    <View
                      className="rounded-2xl p-4"
                      style={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                    >
                      <Text className="text-white/70 text-xs mb-1">Proxima menstruacao</Text>
                      <Text className="text-white text-lg font-bold">
                        {cycleInfo.daysUntilPeriod} dias
                      </Text>
                    </View>
                  </View>
                  <View className="flex-1">
                    <View
                      className="rounded-2xl p-4"
                      style={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                    >
                      <Text className="text-white/70 text-xs mb-1">Ciclo de</Text>
                      <Text className="text-white text-lg font-bold">
                        {cycleLength} dias
                      </Text>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </View>
          </Animated.View>
        )}

        {/* Calendar */}
        <Animated.View
          entering={FadeInUp.delay(200).duration(600).springify()}
          className="mx-6 mb-6"
        >
          <View
            className="rounded-3xl p-5"
            style={{
              backgroundColor: colors.background.card,
              shadowColor: colors.neutral[900],
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 16,
            }}
          >
            {/* Month Navigation */}
            <View className="flex-row items-center justify-between mb-5">
              <Pressable
                onPress={goToPrevMonth}
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.primary[50] }}
              >
                <Ionicons name="chevron-back" size={20} color={colors.primary[500]} />
              </Pressable>
              <Text className="text-warmGray-900 text-lg font-semibold">
                {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </Text>
              <Pressable
                onPress={goToNextMonth}
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.primary[50] }}
              >
                <Ionicons name="chevron-forward" size={20} color={colors.primary[500]} />
              </Pressable>
            </View>

            {/* Weekday Headers */}
            <View className="flex-row mb-2">
              {WEEKDAYS.map((day) => (
                <View
                  key={day}
                  style={{ width: DAY_SIZE, alignItems: "center" }}
                >
                  <Text className="text-warmGray-400 text-xs font-medium">
                    {day}
                  </Text>
                </View>
              ))}
            </View>

            {/* Calendar Grid */}
            <View className="flex-row flex-wrap">
              {calendarDays.map((dayInfo, index) => renderDay(dayInfo, index))}
            </View>

            {/* Legend */}
            <View className="flex-row flex-wrap mt-5 pt-4 border-t border-warmGray-100">
              <View className="flex-row items-center mr-4 mb-2">
                <View className="w-3 h-3 rounded-full bg-rose-200 mr-2" />
                <Text className="text-warmGray-500 text-xs">Periodo</Text>
              </View>
              <View className="flex-row items-center mr-4 mb-2">
                <View className="w-3 h-3 rounded-full bg-violet-200 mr-2" />
                <Text className="text-warmGray-500 text-xs">Ovulacao</Text>
              </View>
              <View className="flex-row items-center mr-4 mb-2">
                <View className="w-3 h-3 rounded-full bg-purple-100 mr-2" />
                <Text className="text-warmGray-500 text-xs">Fertil</Text>
              </View>
              <View className="flex-row items-center mb-2">
                <View
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ borderWidth: 2, borderColor: colors.primary[500] }}
                />
                <Text className="text-warmGray-500 text-xs">Hoje</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Log Period Button */}
        <Animated.View
          entering={FadeInUp.delay(300).duration(600).springify()}
          className="mx-6 mb-6"
        >
          <Pressable
            onPress={handleLogPeriod}
            className="rounded-2xl py-4 active:opacity-80"
            style={{
              backgroundColor: colors.primary[500],
              shadowColor: colors.primary[500],
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
            }}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons name="add-circle" size={24} color="#FFF" />
              <Text className="text-white text-base font-semibold ml-2">
                {selectedDate ? "Marcar Periodo Neste Dia" : "Registrar Menstruacao"}
              </Text>
            </View>
          </Pressable>
        </Animated.View>

        {/* Fertility Chart */}
        {cycleInfo && (
          <Animated.View
            entering={FadeInUp.delay(400).duration(600).springify()}
            className="mx-6 mb-6"
          >
            <View
              className="rounded-3xl p-5"
              style={{
                backgroundColor: colors.background.card,
                shadowColor: colors.neutral[900],
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 16,
              }}
            >
              <Text className="text-warmGray-900 text-lg font-semibold mb-4">
                Probabilidade de Gravidez
              </Text>

              <View className="flex-row items-end justify-between h-32 mb-4">
                {Array.from({ length: 7 }).map((_, index) => {
                  const dayOffset = cycleInfo.ovulationDay - 3 + index;
                  const isFertileDay = dayOffset >= cycleInfo.fertileStart && dayOffset <= cycleInfo.fertileEnd;
                  const isOvDay = dayOffset === cycleInfo.ovulationDay;

                  let height = 20;
                  let color: string = colors.neutral[200];

                  if (isFertileDay) {
                    height = 40 + index * 15;
                    color = colors.secondary[200];
                  }
                  if (isOvDay) {
                    height = 120;
                    color = colors.secondary[600];
                  }

                  return (
                    <View key={index} className="items-center flex-1">
                      <View
                        className="w-8 rounded-t-lg"
                        style={{ height, backgroundColor: color }}
                      />
                      <Text className="text-warmGray-400 text-xs mt-2">
                        {dayOffset}
                      </Text>
                    </View>
                  );
                })}
              </View>

              <View className="flex-row justify-between px-2">
                <Text className="text-warmGray-400 text-xs">Baixa</Text>
                <Text className="text-warmGray-400 text-xs">Media</Text>
                <Text className="text-warmGray-400 text-xs">Alta</Text>
              </View>
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}
