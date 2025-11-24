import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/Colors';
import { refugioNath } from '../assets/images';

export default function RefugioNathScreen() {
  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: Colors.background.dark }}
    >
      <ScrollView className="flex-1">
        <View className="items-center justify-center px-6 py-8">
          {/* Imagem Refúgio Nath - Mãe com bebê e cachorro */}
          <View className="w-full aspect-square mb-6 rounded-3xl overflow-hidden">
            <Image
              source={refugioNath}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          </View>
          
          <Text
            className="text-2xl font-bold text-center mb-4"
            style={{ color: Colors.text.primary }}
          >
            Refúgio Nath
          </Text>
          <Text
            className="text-base text-center mb-2"
            style={{ color: Colors.text.secondary }}
          >
            Seu espaço seguro e acolhedor
          </Text>
          <Text
            className="text-sm text-center"
            style={{ color: Colors.text.tertiary }}
          >
            Um lugar onde você pode ser você mesma, sem julgamentos
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

