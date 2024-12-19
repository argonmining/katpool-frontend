// Common types used across the API
export interface BalanceResponse {
  address: string;
  balance: number;
}

export interface UtxoResponse {
  address: string;
  outpoint: {
    transactionId: string;
    index: number;
  };
  utxoEntry: {
    amount: string[];
    scriptPublicKey: {
      scriptPublicKey: string;
    };
    blockDaaScore: string;
    isCoinbase: boolean;
  };
}

export interface NetworkInfo {
  networkName: string;
  blockCount: string;
  headerCount: string;
  tipHashes: string[];
  difficulty: number;
  pastMedianTime: string;
  virtualParentHashes: string[];
  pruningPointHash: string;
  virtualDaaScore: string;
}

export interface BlockModel {
  header: {
    version: number;
    hashMerkleRoot: string;
    acceptedIdMerkleRoot: string;
    utxoCommitment: string;
    timestamp: string;
    bits: number;
    nonce: string;
    daaScore: string;
    blueWork: string;
    parents: { parentHashes: string[] }[];
    blueScore: string;
    pruningPoint: string;
  };
  transactions: any[];
  verboseData: {
    hash: string;
    difficulty: number;
    selectedParentHash: string;
    transactionIds: string[];
    blueScore: string;
    childrenHashes: string[];
    mergeSetBluesHashes: string[];
    mergeSetRedsHashes: string[];
    isChainBlock: boolean;
  };
}

export interface TxModel {
  subnetwork_id: string;
  transaction_id: string;
  hash: string;
  mass: string;
  block_hash: string[];
  block_time: number;
  is_accepted: boolean;
  accepting_block_hash: string;
  accepting_block_blue_score: number;
  inputs: TxInput[];
  outputs: TxOutput[];
}

export interface TxInput {
  transaction_id: string;
  index: number;
  previous_outpoint_hash: string;
  previous_outpoint_index: string;
  previous_outpoint_address?: string;
  previous_outpoint_amount?: number;
  signature_script: string;
  sig_op_count: string;
}

export interface TxOutput {
  transaction_id: string;
  index: number;
  amount: number;
  script_public_key: string;
  script_public_key_address: string;
  script_public_key_type: string;
  accepting_block_hash?: string;
} 