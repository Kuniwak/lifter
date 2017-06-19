import * as React from "react";
import {GlobalProps} from "../index";
import {AutoResponderEntryEntity} from "../../../domain/auto-responder-entry/auto-responder-entry-entity";

export class AutoResponderBox extends React.Component<GlobalProps, {}> {
    onContextmenu(id: number) {
        this.props.contextmenuAutoResponderEntry(id);
    }

    render() {
        let entries = (this.props.autoResponderEntries || []).map((entry: AutoResponderEntryEntity) => {
            let className = entry.type === 'Directory' ? 'icon-folder' : 'icon-doc';
            return (
                <span
                    className="nav-group-item"
                    title={entry.path.value}
                    key={entry.id}
                    onContextMenu={this.onContextmenu.bind(this, entry.id)}
                >
                    <span className={`icon ${className}`}></span>
                    {entry.pattern.value}
                </span>
            );
        });
        return (
            <div className="pane pane-sm sidebar">
                <nav className="nav-group">
                    <h5 className="nav-group-title">Auto responder</h5>
                    {entries}
                </nav>
            </div>
        );
    }
}