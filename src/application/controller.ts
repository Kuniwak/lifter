import * as React from "react";
import * as Rx from "@reactivex/rxjs/dist/cjs/Rx"

import {eventEmitter} from "../libs/event-emitter";
import {ProxyService} from "../domain/proxy/proxy-service";
import {ClientRequestRepository} from "../domain/client-request/client-request-repository";
import {AutoResponderEntryRepository} from "../domain/auto-responder-entry/auto-responder-entry-repository";
import {AutoResponderBoxEntry} from "../ui/components/auto-responder-box";
import {ClientRequestBoxEntry} from "../ui/components/client-request-box";

export class Controller {
    initialize(win: Window) {
        win.addEventListener("dragover", (e) => e.preventDefault());
        win.addEventListener("dragleave", (e) => e.preventDefault());
        win.addEventListener("drop", (e) => e.preventDefault());
        win.document.body.addEventListener("dragend", (e) => e.preventDefault());

        let autoResponderEntryRepository = new AutoResponderEntryRepository();
        let subject = new Rx.Subject<DragEvent>();
        win.addEventListener("drop", (e) => subject.next(e));
        subject.asObservable().subscribe((e) => {
            autoResponderEntryRepository.storeFilesList(Array.from(e.dataTransfer.files));
        });
        autoResponderEntryRepository.observer.subscribe((autoResponderBoxEntry: AutoResponderBoxEntry) => {
            eventEmitter.emit("fileDrop", autoResponderBoxEntry);
        });

        let clientRequestRepository = new ClientRequestRepository();
        clientRequestRepository.observer.subscribe((clientRequestEntity: ClientRequestBoxEntry) => {
            eventEmitter.emit("clientRequest", clientRequestEntity);
        });

        let proxyService = new ProxyService(autoResponderEntryRepository, clientRequestRepository);
        proxyService.createServer();
    }
}