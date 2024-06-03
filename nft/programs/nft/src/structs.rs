use super::*;

/// The struct containing instructions for creating nfts
#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct CreateNftParams {
    /// Collection Name
    pub collection: String,

    /// Token Name
    pub name: String,

    /// Symbol
    pub symbol: String,

    /// URI
    pub uri: String,

    /// Royalty
    pub royalty: u8,
}
