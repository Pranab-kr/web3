use clap::{Parser, Subcommand};

#[derive(Parser)]
#[command(name = "todo")]
pub struct Cli {
    #[command(subcommand)]
    pub command: Commands,
}

#[derive(Subcommand)]
pub enum Commands {
    Add { title: String },
    List,
    Done { id: u32 },
    Delete { id: u32 },
}
