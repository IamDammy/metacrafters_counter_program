use anchor_lang::prelude::*;

declare_id!("BQj1XSrvSWCekExwJMPVUDEeFeW9rpzjPHPmYARbMLP5");


#[program]
pub mod counter_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.authority = ctx.accounts.user.key();
        counter.count = 0;
        Ok(())
    }

    pub fn increment(ctx: Context<Increment>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count += 1;
        Ok(())
    }

    pub fn decrement(ctx: Context<Decrement>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count -= 1;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init, 
        payer = user, 
        space = 8 + 40, 
        seeds = [user.key().as_ref(), b"counter"], 
        bump
    )]
    pub counter: Account<'info, CounterAccount>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Increment<'info> {
    #[account(mut, has_one = authority)]
    pub counter: Account<'info, CounterAccount>,

    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct Decrement<'info> {
    #[account(mut, has_one = authority)]
    pub counter: Account<'info, CounterAccount>,

    pub authority: Signer<'info>,
}

#[account]
pub struct CounterAccount {
    pub authority: Pubkey,

    pub count: u64,
}


































// #[program]
// pub mod counter_program {
//        use super::*;

//     pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
//         let counter = &mut ctx.accounts.counter;   
//         counter.count = 0;
//         Ok(())
//     }

//     pub fn increment(ctx: Context<Increment>) -> Result<()> {
//         let counter = &mut ctx.accounts.counter;
//         counter.count += 1;
//         Ok(())
//     }

//     pub fn decrement(ctx: Context<Decrement>) -> Result<()> {
//         let counter = &mut ctx.accounts.counter;
//         counter.count -= 1;
//         Ok(())
//     }
// }


// #[derive(Accounts)]
// pub struct Initialize <'info>{
//     #[account(init, payer=user, space = 8 + 8)]
//     pub counter: Account<'info, Counter>,
//     #[account(mut)]
//     pub user: Signer<'info>,
//     pub system_program: Program<'info, System>
// }

// #[derive(Accounts)]
// pub struct Increment<'info> {
//     #[account(mut, has_one = authority)]
//     pub counter: Account<'info, Counter>,
//     pub authority: Signer<'info>, 
// }

// #[account]
// pub struct Counter{
//     pub authority: Pubkey,
//     pub count: u64,
// }

// #[derive(Accounts)]
// pub struct Decrement<'info> {
// #[account(mut)]
// pub counter: Account<'info, Counter>,
// }