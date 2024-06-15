use super::*;

/// Function to create token
pub fn create(ctx: Context<CreateNft>, params: CreateNftParams) -> Result<()> {

    Ok(())
}

#[derive(Accounts)]
#[instruction(params: CreateNftParams)]
pub struct CreateNft<'info> {
    #[account(
        mut,
        seeds = [MAINTAINERS_TAG],
        bump,
    )]
    pub maintainers: Box<Account<'info, Maintainers>>,

    #[account(
        init,
        seeds = [MINT_TAG, params.collection.as_bytes(), params.name.as_bytes()],
        bump,
        payer = payer,
        mint::token_program = token_program,
        mint::decimals = 0,
        mint::authority = payer,
        mint::freeze_authority = payer,
    )]
    pub mint_account: Box<InterfaceAccount<'info, Mint>>,

    #[account(
        mut,
        seeds = [COLLECTION_TAG, params.collection.as_bytes()],
        bump,
        realloc = std::mem::size_of::<Collections>() + ((nft_counter.value as usize + 1) * 32),
        realloc::payer = payer,
        realloc::zero = false,
    )]
    pub collections: Box<Account<'info, Collections>>,

    #[account(
        mut,
        seeds = [COLLECTION_COUNTER_TAG],
        bump,
    )]
    pub nft_counter: Box<Account<'info, NftCounter>>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub system_program: Program<'info, System>,

    pub token_program: Program<'info, Token2022>,
}
