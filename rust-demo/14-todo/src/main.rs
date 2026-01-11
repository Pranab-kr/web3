mod cli;
mod todo;
mod storage;

use clap::Parser;
use cli::{Cli, Commands};
use todo::Todo;
use storage::{load_todos, save_todos};

fn main() -> anyhow::Result<()> {
    let cli = Cli::parse();
    let mut todos = load_todos()?;

    match cli.command {
        Commands::Add { title } => {
            let id = todos.len() as u32 + 1;
            todos.push(Todo { id, title, completed: false });
            save_todos(&todos)?;
            println!("✅ Task added!");
        }

        Commands::List => {
            for todo in &todos {
                let status = if todo.completed { "✔" } else { " " };
                println!("[{}] {}: {}", status, todo.id, todo.title);
            }
        }

        Commands::Done { id } => {
            if let Some(todo) = todos.iter_mut().find(|t| t.id == id) {
                todo.completed = true;
                save_todos(&todos)?;
                println!("🎉 Task marked as done!");
            } else {
                println!("❌ Task not found");
            }
        }

        Commands::Delete { id } => {
            todos.retain(|t| t.id != id);
            save_todos(&todos)?;
            println!("🗑 Task deleted!");
        }
    }

    Ok(())
}
