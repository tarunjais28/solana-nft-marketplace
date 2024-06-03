use super::*;

/// Function to burn the tokens
pub fn burn_nft(ctx: Context<BurnNFT>, collection: String, nft: String) -> Result<()> {
    let seeds = &[
        MINT_TAG,
        collection.as_bytes(),
        nft.as_bytes(),
        &[ctx.bumps.mint_account],
    ];
    let signer = [&seeds[..]];

    let cpi_program = ctx.accounts.token_program.to_account_info();

    // Create the MintTo struct for our context
    let cpi_accounts = Burn {
        mint: ctx.accounts.mint_account.to_account_info(),
        from: ctx.accounts.from.to_account_info(),
        authority: ctx.accounts.authority.to_account_info(),
    };
    token_2022::burn(
        CpiContext::new_with_signer(cpi_program, cpi_accounts, &signer),
        1,
    )?;

    // Emit burn event
    emit!(BurnEvent { nft, amount: 1 });

    Ok(())
}

#[derive(Accounts)]
#[instruction(collection: String, nft: String)]
pub struct BurnNFT<'info> {
    #[account(
        mut,
        seeds = [MAINTAINERS_TAG],
        bump,
    )]
    pub maintainers: Box<Account<'info, Maintainers>>,

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
