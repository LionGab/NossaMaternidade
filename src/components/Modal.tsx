import React from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  fullScreen?: boolean;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  children,
  showCloseButton = true,
  fullScreen = false,
  className = '',
}) => {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        style={styles.backdrop}
        onPress={onClose}
      >
        <SafeAreaView
          edges={['top']}
          className="flex-1 justify-end"
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View
              className={`
                bg-white
                ${fullScreen ? 'h-full' : 'rounded-t-3xl'}
                ${className}
              `}
            >
              {/* Header */}
              {(title || showCloseButton) && (
                <View className="flex-row items-center justify-between px-4 py-4 border-b border-border">
                  {title && (
                    <Text className="text-xl font-semibold text-text flex-1">
                      {title}
                    </Text>
                  )}
                  {showCloseButton && (
                    <TouchableOpacity
                      onPress={onClose}
                      className="p-2 -mr-2"
                    >
                      <Text className="text-2xl text-text-light">
                        ×
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
              
              {/* Content */}
              <View className={fullScreen ? 'flex-1' : ''}>
                {children}
              </View>
            </View>
          </Pressable>
        </SafeAreaView>
      </Pressable>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default Modal;

