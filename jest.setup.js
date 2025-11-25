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

