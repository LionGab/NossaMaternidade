/**
 * Network Monitor
 * Monitora conectividade e gerencia queue de operações offline
 */

import NetInfo, { NetInfoState, NetInfoStateType } from '@react-native-community/netinfo';
import { Platform } from 'react-native';
import { logger } from './logger';

export type NetworkState = 'online' | 'offline' | 'unknown';

export interface NetworkInfo {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  type: NetInfoStateType;
  state: NetworkState;
}

type NetworkChangeCallback = (info: NetworkInfo) => void;

class NetworkMonitor {
  private listeners: Set<NetworkChangeCallback> = new Set();
  private currentState: NetworkInfo = {
    isConnected: false,
    isInternetReachable: null,
    type: 'unknown',
    state: 'unknown',
  };
  private offlineQueue: Array<() => Promise<void>> = [];
  private isProcessingQueue = false;

  constructor() {
    this.initialize();
  }

  /**
   * Inicializa o monitor de rede
   */
  private async initialize(): Promise<void> {
    // Obter estado inicial
    const state = await NetInfo.fetch();
    this.updateState(state);

    // Escutar mudanças
    NetInfo.addEventListener((state) => {
      this.updateState(state);
    });
  }

  /**
   * Atualiza o estado da rede
   */
  private updateState(state: NetInfoState): void {
    const wasOnline = this.currentState.isConnected;
    const isOnline = state.isConnected ?? false;

    this.currentState = {
      isConnected: isOnline,
      isInternetReachable: state.isInternetReachable ?? null,
      type: state.type,
      state: isOnline ? 'online' : 'offline',
    };

    // Notificar listeners
    this.listeners.forEach((callback) => {
      try {
        callback(this.currentState);
      } catch (error) {
        console.error('[NetworkMonitor] Erro ao executar callback:', error);
      }
    });

    // Se voltou online, processar queue
    if (!wasOnline && isOnline) {
      logger.info('Conexão restaurada, processando queue offline');
      this.processOfflineQueue();
    }
  }

  /**
   * Obtém o estado atual da rede
   */
  getState(): NetworkInfo {
    return { ...this.currentState };
  }

  /**
   * Verifica se está online
   */
  isOnline(): boolean {
    return this.currentState.isConnected === true;
  }

  /**
   * Adiciona listener para mudanças de rede
   */
  addListener(callback: NetworkChangeCallback): () => void {
    this.listeners.add(callback);

    // Retornar função de remoção
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Adiciona operação à queue offline
   */
  addToOfflineQueue(operation: () => Promise<void>): void {
    this.offlineQueue.push(operation);
    logger.debug(`Operação adicionada à queue (total: ${this.offlineQueue.length})`);

    // Se estiver online, tentar processar imediatamente
    if (this.isOnline() && !this.isProcessingQueue) {
      this.processOfflineQueue();
    }
  }

  /**
   * Processa a queue de operações offline
   */
  private async processOfflineQueue(): Promise<void> {
    if (this.isProcessingQueue || !this.isOnline() || this.offlineQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;
    logger.info(`Processando ${this.offlineQueue.length} operações da queue`);

    const operations = [...this.offlineQueue];
    this.offlineQueue = [];

    for (const operation of operations) {
      try {
        if (this.isOnline()) {
          await operation();
        } else {
          // Se perdeu conexão durante processamento, recolocar na queue
          this.offlineQueue.push(operation);
        }
      } catch (error) {
        console.error('[NetworkMonitor] Erro ao processar operação da queue:', error);
        // Recolocar na queue para tentar novamente depois
        this.offlineQueue.push(operation);
      }
    }

    this.isProcessingQueue = false;

    if (this.offlineQueue.length > 0) {
      logger.debug(`${this.offlineQueue.length} operações ainda na queue`);
    }
  }

  /**
   * Limpa a queue offline
   */
  clearQueue(): void {
    this.offlineQueue = [];
    logger.info('Queue offline limpa');
  }

  /**
   * Obtém tamanho da queue
   */
  getQueueSize(): number {
    return this.offlineQueue.length;
  }
}

// Singleton instance
export const networkMonitor = new NetworkMonitor();

// Export helper functions
export const isOnline = () => networkMonitor.isOnline();
export const getNetworkState = () => networkMonitor.getState();
export const addNetworkListener = (callback: NetworkChangeCallback) => networkMonitor.addListener(callback);

