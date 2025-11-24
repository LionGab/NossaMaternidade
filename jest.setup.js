// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => {
    const storage: Record<string, string> = {};
    return {
        __esModule: true,
        default: {
            getItem: jest.fn((key: string) => Promise.resolve(storage[key] || null)),
            setItem: jest.fn((key: string, value: string) => {
                storage[key] = value;
                return Promise.resolve();
            }),
            removeItem: jest.fn((key: string) => {
                delete storage[key];
                return Promise.resolve();
            }),
            clear: jest.fn(() => {
                Object.keys(storage).forEach(key => delete storage[key]);
                return Promise.resolve();
            }),
        },
    };
});

// Mock React Native Platform
jest.mock('react-native', () => {
    const RN = jest.requireActual('react-native');
    return {
        ...RN,
        Platform: {
            OS: 'ios',
            select: jest.fn((dict) => dict.ios || dict.default),
        },
    };
});

// Mock expo modules
jest.mock('expo-camera', () => ({
    Camera: {
        requestCameraPermissionsAsync: jest.fn(() => Promise.resolve({ granted: true })),
        requestMicrophonePermissionsAsync: jest.fn(() => Promise.resolve({ granted: true })),
    },
}));

jest.mock('expo-image-picker', () => ({
    requestMediaLibraryPermissionsAsync: jest.fn(() => Promise.resolve({ granted: true })),
    launchImageLibraryAsync: jest.fn(() => Promise.resolve({ cancelled: false, uri: 'mock-uri' })),
    launchCameraAsync: jest.fn(() => Promise.resolve({ cancelled: false, uri: 'mock-uri' })),
}));

// Mock console methods para não poluir os logs durante os testes
global.console = {
    ...console,
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
};

// Mock __DEV__
global.__DEV__ = true;

