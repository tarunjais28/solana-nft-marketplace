use super::*;

/// Function to create token
pub fn create(ctx: Context<CreateNft>, params: CreateNftParams) -> Result<()> {
    ctx.accounts.initialize_token_metadata(params.clone())?;
    ctx.accounts.update_mint_authority()?;
    ctx.accounts.mint_account.reload()?;

    let counter = &mut ctx.accounts.nft_counter;
    counter.increement();

    let collections = &mut ctx.accounts.collections;
    collections.add_nft(ctx.accounts.mint_account.key());

    // transfer minimum rent to mint account
    update_account_lamports_to_minimum_balance(
        ctx.accounts.mint_account.to_account_info(),
        ctx.accounts.payer.to_account_info(),
        ctx.accounts.system_program.to_account_info(),
    )?;

    // Emit create token event
    emit!(CreateNftEvent { name: params.name });

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
        extensions::metadata_pointer::authority = payer,
        extensions::metadata_pointer::metadata_address = mint_account,
        extensions::close_authority::authority = payer,
        extensions::permanent_delegate::delegate = payer,
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

impl<'info> CreateNft<'info> {
    #[inline(never)]
    fn initialize_token_metadata(&self, params: CreateNftParams) -> ProgramResult {
        let cpi_accounts = TokenMetadataInitialize {
            token_program_id: self.token_program.to_account_info(),
            mint: self.mint_account.to_account_info(),
            metadata: self.mint_account.to_account_info(), // metadata account is the mint, since data is stored in mint
            mint_authority: self.payer.to_account_info(),
            update_authority: self.payer.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(self.token_program.to_account_info(), cpi_accounts);

        token_metadata_initialize(cpi_ctx, params.name, params.symbol, params.uri)?;

        Ok(())
    }

    #[inline(never)]
    fn update_mint_authority(&self) -> ProgramResult {
        let cpi_accounts = SetAuthority {
            current_authority: self.payer.to_account_info(),
            account_or_mint: self.mint_account.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(self.token_program.to_account_info(), cpi_accounts);

        set_authority(
            cpi_ctx,
            spl_token_2022::instruction::AuthorityType::MintTokens,
            Some(self.mint_account.key()),
        )?;

        Ok(())
    }
}

#[inline(never)]
pub fn update_account_lamports_to_minimum_balance<'info>(
    account: AccountInfo<'info>,
    payer: AccountInfo<'info>,
    system_program: AccountInfo<'info>,
) -> Result<()> {
    let extra_lamports = Rent::get()?.minimum_balance(account.data_len()) - account.get_lamports();
    if extra_lamports > 0 {
        invoke(
            &anchor_lang::solana_program::system_instruction::transfer(
                payer.key,
                account.key,
                extra_lamports,
            ),
            &[payer, account, system_program],
        )?;
    }
    Ok(())
}
