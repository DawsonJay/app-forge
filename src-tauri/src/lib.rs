// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use std::fs;
use std::path::PathBuf;
use tauri::Manager;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

// Load a document from the file system
#[tauri::command]
fn load_document(path: String) -> Result<String, String> {
    fs::read_to_string(&path)
        .map_err(|e| format!("Failed to read file: {}", e))
}

// Get standard profile path using Tauri's app data directory
#[tauri::command]
fn get_profile_path(app: tauri::AppHandle) -> Result<String, String> {
    let app_data_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app data directory: {}", e))?;
    
    // Create directory if it doesn't exist
    fs::create_dir_all(&app_data_dir)
        .map_err(|e| format!("Failed to create app data directory: {}", e))?;
    
    let profile_path = app_data_dir.join("profile.json");
    Ok(profile_path.to_string_lossy().to_string())
}

// Check if profile exists at standard location
#[tauri::command]
fn profile_exists(app: tauri::AppHandle) -> bool {
    match get_profile_path(app) {
        Ok(path) => PathBuf::from(path).exists(),
        Err(_) => false,
    }
}

// Save profile data to a file (uses standard path if none provided)
#[tauri::command]
fn save_profile(
    profile: String,
    app: tauri::AppHandle,
    path: Option<String>,
) -> Result<(), String> {
    let file_path = match path {
        Some(p) => p,
        None => get_profile_path(app)?,
    };
    
    // Ensure parent directory exists
    if let Some(parent) = PathBuf::from(&file_path).parent() {
        fs::create_dir_all(parent)
            .map_err(|e| format!("Failed to create directory: {}", e))?;
    }
    
    fs::write(&file_path, profile)
        .map_err(|e| format!("Failed to write file: {}", e))
}

// Load profile data from a file (uses standard path if none provided)
#[tauri::command]
fn load_profile(app: tauri::AppHandle, path: Option<String>) -> Result<String, String> {
    let file_path = match path {
        Some(p) => p,
        None => get_profile_path(app)?,
    };
    
    fs::read_to_string(&file_path)
        .map_err(|e| format!("Failed to read file: {}", e))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            load_document,
            get_profile_path,
            profile_exists,
            save_profile,
            load_profile
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
