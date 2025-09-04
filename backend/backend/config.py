# /backend/config.py

# Configuration Dictionary - Centralized Settings
CONFIG = {
    "regions": {
        "arabian_sea": {
            "name": "Arabian Sea",
            "bounds": [50, 80, 5, 25],
            "pfz_zones": {
                "Gujarat Coast": {"lat": [20, 22], "lon": [68, 71]},
                "Goa-Karnataka Coast": {"lat": [13, 16], "lon": [73, 75]}
            }
        },
        "bay_of_bengal": {
            "name": "Bay of Bengal", 
            "bounds": [80, 100, 5, 22],
            "pfz_zones": {
                "North Andhra Coast": {"lat": [17, 19], "lon": [84, 86]},
                "Odisha Coast": {"lat": [19, 21], "lon": [86, 88]}
            }
        },
        "north_indian_ocean": {
            "name": "North Indian Ocean",
            "bounds": [40, 100, 0, 30],
            "pfz_zones": {
                "Central Indian Ocean": {"lat": [5, 15], "lon": [60, 80]},
                "Western Indian Ocean": {"lat": [10, 20], "lon": [50, 70]}
            }
        }
    },
    "data_settings": {
        "years_to_fetch": [2022, 2024], # Reduced range for faster demo
        "months": [6, 7, 8],  # June, July, August
        "max_depth": 2000,
        "sample_size_for_viz": 5000
    },
    "model_settings": {
        "test_size": 0.2,
        "random_state": 42,
        "n_estimators": 100,
        "model_preference": "lightgbm"  # Options: "lightgbm", "xgboost", "randomforest"
    },
    "visualization_settings": {
        "mapbox_style": "carto-positron",
        "color_scale": "viridis",
        "figure_width": 1200,
        "figure_height": 800
    }
}