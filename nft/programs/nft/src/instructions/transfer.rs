use super::*;

/// Function to transfer the nft
pub fn transfer_nft(ctx: Context<TransferNFT>, collection: String, nft: String) -> Result<()> {
    let cpi_program = ctx.accounts.token_program.to_account_info();

    let seeds = &[
        MINT_TAG,
        collection.as_bytes(),
        nft.as_bytes(),
        &[ctx.bumps.mint_account],
    ];
    let signer = [&seeds[..]];

    // Create the Transfer struct for our context
    let cpi_accounts = TransferChecked {
        mint: ctx.accounts.mint_account.to_account_info(),
        to: ctx.accounts.to_account.to_account_info(),
        authority: ctx.accounts.authority.to_account_info(),
        from: ctx.accounts.from_account.to_account_info(),
    };

    token_2022::transfer_checked(
        CpiContext::new_with_signer(cpi_program, cpi_accounts, &signer),
        1,
        ctx.accounts.mint_account.decimals,
    )?;

    // Emit transfer event
    emit!(TransferEvent {
        nft,
        amount: 1,
        from: ctx.accounts.from_account.to_account_info().key(),
        to: ctx.accounts.to_account.to_account_info().key()
    });

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

    /// CHECK: This is the token account that we want to transfer tokens from
    #[account(mut)]
    pub from_account: Box<InterfaceAccount<'info, TokenAccount>>,

    /// CHECK: This is the token account that we want to transfer tokens to
    #[account(mut)]
    pub to_account: Box<InterfaceAccount<'info, TokenAccount>>,

    /// CHECK: the authority of the mint account
    #[account(mut)]
    pub authority: Signer<'info>,

    pub token_program: Program<'info, Token2022>,

    pub system_program: Program<'info, System>,
}
