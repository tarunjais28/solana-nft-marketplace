use super::*;

/// Function to mint the tokens
///
/// This function can throw following errors:
///   - Amount Can't Be Zero (when user passes 0 amount for mint).
pub fn mint_nft(ctx: Context<MintNFT>, collection: String, nft: String) -> Result<()> {
    let seeds = &[
        MINT_TAG,
        collection.as_bytes(),
        nft.as_bytes(),
        &[ctx.bumps.mint_account],
    ];
    let signer = [&seeds[..]];
    let cpi_program = ctx.accounts.token_program.to_account_info();

    // Create the MintTo struct for our context
    let cpi_accounts = MintTo {
        mint: ctx.accounts.mint_account.to_account_info(),
        to: ctx.accounts.to_account.to_account_info(),
        authority: ctx.accounts.mint_account.to_account_info(),
    };

    token_2022::mint_to(
        CpiContext::new_with_signer(cpi_program, cpi_accounts, &signer),
        1,
    )?;

    ctx.accounts.update_mint_authority(&signer)?;

    // Emit mint event
    emit!(MintEvent { nft, amount: 1 });

    Ok(())
}

#[derive(Accounts)]
#[instruction(collection: String, nft: String)]
pub struct MintNFT<'info> {
    /// CHECK: This is the token that we want to mint
    #[account(
        mut,
        seeds = [MINT_TAG, collection.as_bytes(), nft.as_bytes()],
        bump,
    )]
    pub mint_account: Box<InterfaceAccount<'info, Mint>>,

    /// CHECK: This is the token account that we want to mint tokens to (ATA)
    #[account(
        init_if_needed,
        payer = authority,
        associated_token::mint = mint_account,
        associated_token::authority = authority,
        associated_token::token_program = token_program,
    )]
    pub to_account: InterfaceAccount<'info, TokenAccount>,

    /// CHECK: the authority of the mint account
    #[account(mut)]
    pub authority: Signer<'info>,

    pub token_program: Program<'info, Token2022>,

    pub system_program: Program<'info, System>,

    pub associated_token_program: Program<'info, AssociatedToken>,
}

impl<'info> MintNFT<'info> {
    #[inline(never)]
    fn update_mint_authority(&self, signer: &[&[&[u8]]; 1]) -> ProgramResult {
        let cpi_accounts = SetAuthority {
            current_authority: self.mint_account.to_account_info(),
            account_or_mint: self.mint_account.to_account_info(),
        };
        let cpi_ctx =
            CpiContext::new_with_signer(self.token_program.to_account_info(), cpi_accounts, signer);

        set_authority(
            cpi_ctx,
            spl_token_2022::instruction::AuthorityType::MintTokens,
            None,
        )?;

        Ok(())
    }
}
