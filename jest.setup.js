// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => {
    const storage = {};
    return {
        __esModule: true,
        default: {
            getItem: jest.fn((key) => Promise.resolve(storage[key] || null)),
            setItem: jest.fn((key, value) => {
                storage[key] = value;
                return Promise.resolve();
            }),
            removeItem: jest.fn((key) => {
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

// Mock expo-secure-store
jest.mock('expo-secure-store', () => ({
    getItemAsync: jest.fn(() => Promise.resolve(null)),
    setItemAsync: jest.fn(() => Promise.resolve()),
    deleteItemAsync: jest.fn(() => Promise.resolve()),
}));

// Mock expo-constants
jest.mock('expo-constants', () => ({
    default: {
        expoConfig: {
            extra: {
                supabaseUrl: 'https://test.supabase.co',
                supabaseAnonKey: 'test-key',
            },
        },
    },
}));

// Mock expo-file-system
jest.mock('expo-file-system', () => ({
    documentDirectory: '/mock/document/',
    cacheDirectory: '/mock/cache/',
    bundleDirectory: '/mock/bundle/',
    readAsStringAsync: jest.fn(() => Promise.resolve('')),
    writeAsStringAsync: jest.fn(() => Promise.resolve()),
    deleteAsync: jest.fn(() => Promise.resolve()),
    makeDirectoryAsync: jest.fn(() => Promise.resolve()),
    getInfoAsync: jest.fn(() => Promise.resolve({ exists: false })),
    downloadAsync: jest.fn(() => Promise.resolve({ uri: '', status: 200 })),
    uploadAsync: jest.fn(() => Promise.resolve({ body: {}, status: 200 })),
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

