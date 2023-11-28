# D

A simple website. Written by Vue 3.

Data persistents in index DB, and local first after syncing but not using CRDTs.

## Structure

Establishing IndexDb for the first time.

```mermaid
sequenceDiagram
    participant Server as Server Database
    participant API as /sync/collection Interface
    participant Frontend as Frontend
    participant Stream as Stream Processing
    participant IndexDB as IndexDb

    Server->>API: Full data stream transmission loss
    API->>Frontend: Data stream
    Frontend->>Stream: Receiving data stream
    loop Parse each line of data
        Stream->>IndexDB: Enter each line of data into respective tables
    end
```

Data binding with Pinia to implement UI reactivity.

```mermaid
sequenceDiagram
    participant IndexDB as IndexDb
    participant Hook as Hook (on change)
    participant Pinia as Pinia Store
    participant UI as User Interface

    IndexDB->>Hook: Change event
    Hook->>Pinia: Update/inject data
    Pinia->>UI: Render/update reactive data
```

Subsequent incremental updates.

```mermaid
flowchart LR
    subgraph server [Server]
        db[Database]
        checksum_table[Checksum Table]
        hooks[Update Hooks]
        db --> checksum_table
        db --> hooks
    end
    subgraph operations [Operations]
        add_record[Add Record]
        update_record[Update Record]
        delete_record[Delete Record]
        add_record --> hooks
        update_record --> hooks
        delete_record --> hooks
    end
    cronjob[Cron Job] --> db
    hooks -->|Update Checksums| checksum_table

    server -.-> operations
    server --> cronjob


```

<!-- 建立 /sync/deta 接口，接受一个上次同步完成的时间，根据这个时间查询这段时间的 db 更新记录，前端请求，增量更新 indexDb -->

```mermaid
sequenceDiagram
    participant Frontend
    participant /sync/deta API
    participant Database

    Frontend->>/sync/deta API: Request sync with last sync timestamp
    /sync/deta API->>Database: Query updates since last sync timestamp
    Database-->>/sync/deta API: Updated records
    /sync/deta API-->>Frontend: Updated records
    Frontend->>Frontend: Incrementally update indexDb with records
```
