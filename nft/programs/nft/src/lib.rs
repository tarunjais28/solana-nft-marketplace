use crate::{constants::*, enums::*, errors::*, events::*, instructions::*, states::*, structs::*};
use anchor_lang::{
    prelude::*,
    solana_program::{
        account_info::AccountInfo, entrypoint::ProgramResult, program::invoke, rent::Rent,
        sysvar::Sysvar,
    },
    Lamports,
};
use anchor_spl::{
    associated_token::AssociatedToken,
    token_2022::{self, set_authority, Burn, MintTo, SetAuthority, Token2022, TransferChecked},
    token_interface::{token_metadata_initialize, Mint, TokenAccount, TokenMetadataInitialize},
};

mod constants;
mod enums;
mod errors;
mod events;
mod instructions;
mod states;
mod structs;

declare_id!("9dDzq4c5y68STfWnRPVt1AD3SoDhJygRyUWvjiKnPmSj");

#[program]
pub mod nft {
    use super::*;

    pub fn init(ctx: Context<Initialize>) -> Result<()> {
        instructions::initialize(ctx)
    }

    pub fn init_collection(ctx: Context<InitCollection>, collection: String) -> Result<()> {
        instructions::process_init_collection(ctx, collection)
    }

    pub fn manage_admin(ctx: Context<UpdateAdmin>, address: Pubkey) -> Result<()> {
        instructions::update_admin(ctx, address)
    }

    pub fn add_sub_admin_accounts(
        ctx: Context<UpdateSubAdmins>,
        addresses: Vec<Pubkey>,
    ) -> Result<()> {
        instructions::add_sub_admins(ctx, addresses)
    }

    pub fn remove_sub_admin_accounts(
        ctx: Context<UpdateSubAdmins>,
        addresses: Vec<Pubkey>,
    ) -> Result<()> {
        instructions::remove_sub_admins(ctx, addresses)
    }

    pub fn create_nft(ctx: Context<CreateNft>, params: CreateNftParams) -> Result<()> {
        instructions::create(ctx, params)
    }

    pub fn mint(ctx: Context<MintNFT>, collection: String, nft: String) -> Result<()> {
        instructions::mint_nft(ctx, collection, nft)
    }

    pub fn burn(ctx: Context<BurnNFT>, collection: String, nft: String) -> Result<()> {
        instructions::burn_nft(ctx, collection, nft)
    }

    pub fn transfer(ctx: Context<TransferNFT>, collection: String, nft: String) -> Result<()> {
        instructions::transfer_nft(ctx, collection, nft)
    }

    pub fn close_nft(ctx: Context<CloseNFT>) -> Result<()> {
        instructions::close(ctx)
    }
}
