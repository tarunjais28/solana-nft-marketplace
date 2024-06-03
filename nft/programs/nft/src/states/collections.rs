use super::*;

#[account]
pub struct Collections {
    /// NFTs mint address
    pub nfts: Vec<Pubkey>,
}

impl Collections {
    // No need to check for dublicacy as pda handles it by default
    pub fn add_nft(&mut self, nft: Pubkey) {
        self.nfts.push(nft);
    }

    pub fn remove_nft(&mut self, nft: Pubkey) {
        self.nfts.retain(|data| nft.ne(data));
    }
}

#[account]
pub struct NftCounter {
    /// Total no. of NFTs
    pub value: u64,
}

impl NftCounter {
    pub fn init(&mut self) {
        self.value = 0;
    }

    pub fn increement(&mut self) {
        self.value += 1;
    }

    pub fn decreement(&mut self) {
        self.value -= 1;
    }
}
