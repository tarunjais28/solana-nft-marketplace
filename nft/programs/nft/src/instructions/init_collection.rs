use super::*;

/// Function to init collection
pub fn process_init_collection(_: Context<InitCollection>, collection: String) -> Result<()> {
    // Emit init collection event
    emit!(InitCollectionEvent { name: collection });

    Ok(())
}

#[derive(Accounts)]
#[instruction(collection: String)]
pub struct InitCollection<'info> {
    #[account(
        init,
        seeds = [COLLECTION_TAG, collection.as_bytes()],
        bump,
        space = std::mem::size_of::<Collections>() + ((nft_counter.value as usize + 1) * 32),
        payer = payer,
    )]
    pub collections: Box<Account<'info, Collections>>,

    #[account(
        seeds = [COLLECTION_COUNTER_TAG],
        bump,
    )]
    pub nft_counter: Box<Account<'info, NftCounter>>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub system_program: Program<'info, System>,
}
