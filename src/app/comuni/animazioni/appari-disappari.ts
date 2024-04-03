import { animate, state, style, transition, trigger } from "@angular/animations";

const animazione = trigger('appari', [
    state('void', style({ opacity: 0 })),
    state('*', style({ opacity: 1 })),
    transition(':enter', animate('300ms cubic-bezier(0.22, 0.61, 0.36, 1)')),
    transition(':leave', [
        style({ opacity: 1 }),
        animate('300ms cubic-bezier(0.22, 0.61, 0.36, 1)', style({ opacity: 0 }))
    ])
])

export { animazione }