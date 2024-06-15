use super::*;

/// Function to close nft
/// Only called by the authority which holds close access
pub fn close(ctx: Context<CloseNFT>) -> Result<()> {

    Ok(())
}

#[derive(Accounts)]
#[instruction()]
pub struct CloseNFT<'info> {
    /// CHECK: Mint Account to be closed
    #[account(mut)]
    pub mint_account: AccountInfo<'info>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub token_program: Program<'info, Token2022>,
}
