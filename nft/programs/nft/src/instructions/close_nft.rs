use super::*;

/// Function to close nft
/// Only called by the authority which holds close access
pub fn close(ctx: Context<CloseNFT>) -> Result<()> {
    let cpi_program = ctx.accounts.token_program.to_account_info();

    // Create the MintTo struct for our context
    let cpi_accounts = token_2022::CloseAccount {
        authority: ctx.accounts.authority.to_account_info(),
        account: ctx.accounts.mint_account.to_account_info(),
        destination: ctx.accounts.authority.to_account_info(),
    };

    token_2022::close_account(CpiContext::new(cpi_program, cpi_accounts))?;

    // Emit close nft event
    emit!(CloseNftEvent {
        mint_account: ctx.accounts.mint_account.key()
    });

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
