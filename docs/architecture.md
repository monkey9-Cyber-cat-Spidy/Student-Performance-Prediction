# System Architecture

Nexus ML is engineered as a decoupled academic intelligence portal, optimized for low-latency inference and high-dimensional model execution.

## High-Fidelity Ecosystem

The system follows a modern three-tier architecture, ensuring that the heavy lifting of machine learning prediction is completely isolated from the user interface.

```mermaid
flowchart TD
    %% User Layer
    User([Academic User])
    
    subgraph UI ["User Interface (React + Vite)"]
        Dash[Interactive Dashboard]
        WhatIf[Counterfactual Engine]
    end

    %% Communication Layer
    subgraph API ["Logic Orchestration (FastAPI)"]
        Router[REST Endpoints]
        Validator[Pydantic Schema Validator]
    end

    %% Intelligence Layer
    subgraph ML ["Intelligence Engine (Scikit-Learn)"]
        Xform[One-Hot Transformer]
        Model[Random Forest Regressor]
        Logic[Output Processing]
    end

    %% Connections
    User -- Interaction --> Dash
    Dash -- Request Payload --> Router
    Router -- Check --> Validator
    Validator -- Validated Vector --> Xform
    Xform -- Sparse Matrix --> Model
    Model -- Prediction --> Logic
    Logic -- Success Delta --> Router
    Router -- JSON Response --> Dash
    Dash -- Visualization --> User

    %% Styling
    style UI fill:#f1f5f9,stroke:#6366f1,stroke-width:2px
    style API fill:#f1f5f9,stroke:#06b6d4,stroke-width:2px
    style ML fill:#f1f5f9,stroke:#4f46e5,stroke-width:2px
    style User fill:#6366f1,color:#fff
```

---

## Technical Deep Dive

### 1. Data Transformation Strategy
Nexus ML utilizes a **Sparse Matrix Transformation** strategy. Categorical student features (e.g., *Sex*, *High School Type*) are dynamically expanded into a one-hot encoded vector at runtime. This ensures that the Random Forest model processes the exact feature geometry it was trained on, minimizing "out-of-distribution" errors.

### 2. Counterfactual Inference
The "What-If" engine allows users to mutate behavioral variables (like *Attendance* or *Weekly Study Hours*) while keeping demographic variables frozen. This isolates the mathematical impact of specific changes on the final academic trajectory.

---

## Sequence Execution
The following sequence demonstrates the lifecycle of a single prediction request.

```mermaid
sequenceDiagram
    participant U as User (React)
    participant A as API (FastAPI)
    participant M as Model (Sklearn)

    U->>A: POST /predict {StudentData}
    A->>A: Validate Schema (Pydantic)
    A->>M: Transform Data (One-Hot)
    M->>M: Model Inference
    M-->>A: Raw Prediction Result
    A-->>U: JSON Response {status: success, score: 0.XX}
    U->>U: Update Visualization
```
