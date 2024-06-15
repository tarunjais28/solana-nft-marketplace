use super::*;

/// Function to burn the tokens
pub fn burn_nft(ctx: Context<BurnNFT>, collection: String, nft: String) -> Result<()> {

    Ok(())
}

#[derive(Accounts)]
#[instruction(collection: String, nft: String)]
pub struct BurnNFT<'info> {
    /// CHECK: This is the token that we want to mint
    #[account(
        mut,
        seeds = [MINT_TAG, collection.as_bytes(), nft.as_bytes()],
        bump,
    )]
    pub mint_account: Box<InterfaceAccount<'info, Mint>>,

    #[account(
        mut,
        seeds = [COLLECTION_TAG, collection.as_bytes()],
        bump,
        realloc = std::mem::size_of::<Collections>() + ((nft_counter.value as usize + 1) * 32),
        realloc::payer = authority,
        realloc::zero = false,
    )]
    pub collections: Box<Account<'info, Collections>>,

    #[account(
        mut,
        seeds = [COLLECTION_COUNTER_TAG],
        bump,
    )]
    pub nft_counter: Box<Account<'info, NftCounter>>,

    /// CHECK: This is the token account that we want to burn tokens from
    #[account(mut)]
    pub from: AccountInfo<'info>,

    /// CHECK: the authority of the mint account
    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,

    pub token_program: Program<'info, Token2022>,
}
