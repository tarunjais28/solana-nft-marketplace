use super::*;

#[event]
pub struct InitEvent {
    pub admin: Pubkey,
    pub sub_admin: Pubkey,
}

#[event]
pub struct InitCollectionEvent {
    pub name: String,
}

#[event]
pub struct CreateNftEvent {
    /// NFT Name
    pub name: String,
}

#[event]
pub struct MintEvent {
    pub nft: String,
    pub amount: u64,
}

#[event]
pub struct TransferEvent {
    pub nft: String,
    pub from: Pubkey,
    pub to: Pubkey,
    pub amount: u64,
}

#[event]
pub struct BurnEvent {
    pub nft: String,
    pub amount: u64,
}

#[event]
pub struct UpdateAdminEvent {
    pub from: Pubkey,
    pub to: Pubkey,
}

#[event]
pub struct UpdateSubAdminsEvent {
    pub update_type: UpdateType,
    pub addresses: Vec<Pubkey>,
}
