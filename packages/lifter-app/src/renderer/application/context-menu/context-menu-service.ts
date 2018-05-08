import {
    BrowserWindow,
    ContextMenuParams,
    MenuItemConstructorOptions,
} from "electron";
import * as contextMenu from "electron-context-menu";

type ContextMenuEventType = "prepend" | "append";

interface ContextMenuHandler {
    (event: ContextMenuEvent): MenuItemConstructorOptions | null;
}

export interface ContextMenuEvent {
    type: ContextMenuEventType;
    params: ContextMenuParams;
    browserWindow: BrowserWindow;
}

export class ContextMenuService {
    private handlers: ContextMenuHandler[] = [];

    bind() {
        let next = (
            type: ContextMenuEventType,
            params: ContextMenuParams,
            browserWindow: BrowserWindow,
        ): MenuItemConstructorOptions[] => {
            let event: ContextMenuEvent = {
                type,
                params,
                browserWindow,
            };
            return <MenuItemConstructorOptions[]>this.handlers
                .map(handler => handler(event))
                .filter(result => !!result);
        };
        let handler = (type: ContextMenuEventType) => {
            return (
                params: ContextMenuParams,
                browserWindow: BrowserWindow,
            ) => {
                let results = next(type, params, browserWindow);
                return results.length ? results : undefined;
            };
        };
        contextMenu({
            prepend: handler("prepend"),
            append: handler("append"),
        });
    }

    subscribe(handler: ContextMenuHandler): () => void {
        this.handlers.push(handler);
        return () => {
            this.handlers = this.handlers.filter(val => val !== handler);
        };
    }
}
