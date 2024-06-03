use super::*;

/// Function to initialize the contract
pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
    let caller = ctx.accounts.authority.to_account_info().key();
    let maintainers = &mut ctx.accounts.maintainers;
    maintainers.save(caller);

    let counter = &mut ctx.accounts.nft_counter;
    counter.init();

    // Emit init event
    emit!(InitEvent {
        admin: caller,
        sub_admin: caller
    });

    Ok(())
}

#[derive(Accounts)]
#[instruction()]
pub struct Initialize<'info> {
    #[account(
        init_if_needed,
        seeds = [MAINTAINERS_TAG],
        bump,
        payer = authority,
        space = std::mem::size_of::<Maintainers>() + 32
    )]
    pub maintainers: Box<Account<'info, Maintainers>>,

    #[account(
        init,
        seeds = [COLLECTION_COUNTER_TAG],
        bump,
        space = std::mem::size_of::<NftCounter>() + 8,
        payer = authority,
    )]
    pub nft_counter: Box<Account<'info, NftCounter>>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}
