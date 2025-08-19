declare namespace ConfigTable {
    type PropsDialog = {
        open: boolean
        onCancel: () => void
        header: Header
    }

    type BaseConfigObj = {
        id: string
        connectorName: string
        databaseType: string
        baseConfig: Record<string, any>
        tables: any[]
        createdAt: string,
        status?: string
    }

    type Header = {
        type: "EDIT" | "ADD";
        data: Record<string, string | number> | null | BaseConfigObj;
    }

    type Pagination = {
        pageSize: number,
        pageIndex: number,
        total: number,
        sort?: string,
        search?: string
    }
}