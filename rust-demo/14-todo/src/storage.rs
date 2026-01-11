use crate::todo::Todo;
use std::fs;
use anyhow::Result;

const FILE_PATH: &str = "todo.json";

pub fn load_todos() -> Result<Vec<Todo>> {
    if let Ok(data) = fs::read_to_string(FILE_PATH) {
        let todos = serde_json::from_str(&data)?;
        Ok(todos)
    } else {
        Ok(vec![])
    }
}

pub fn save_todos(todos: &Vec<Todo>) -> Result<()> {
    let data = serde_json::to_string_pretty(todos)?;
    fs::write(FILE_PATH, data)?;
    Ok(())
}
