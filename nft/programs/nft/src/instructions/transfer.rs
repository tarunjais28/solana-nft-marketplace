use super::*;

/// Function to transfer the nft
pub fn transfer_nft(ctx: Context<TransferNFT>, collection: String, nft: String) -> Result<()> {

    Ok(())
}

#[derive(Accounts)]
#[instruction(collection: String, nft: String)]
pub struct TransferNFT<'info> {
    /// CHECK: This is the token that we want to mint
    #[account(
        mut,
        seeds = [MINT_TAG, collection.as_bytes(), nft.as_bytes()],
        bump,
    )]
    pub mint_account: Box<InterfaceAccount<'info, Mint>>,

    /// CHECK: ATA of from_account
    #[account(
        init_if_needed,
        payer = authority,
        associated_token::mint = mint_account,
        associated_token::authority = authority,
        associated_token::token_program = token_program,
    )]
    pub from_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    /// CHECK: ATA of to_account
    #[account(
        init_if_needed,
        payer = authority,
        associated_token::mint = mint_account,
        associated_token::authority = to_account,
        associated_token::token_program = token_program,
    )]
    pub to_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    /// CHECK: the authority of the mint account
    #[account(mut)]
    pub authority: Signer<'info>,

    /// CHECK: To account
    #[account(mut)]
    pub to_account: AccountInfo<'info>,

    pub token_program: Program<'info, Token2022>,

    pub system_program: Program<'info, System>,

    pub associated_token_program: Program<'info, AssociatedToken>,
}
