# NG Suspense

Suspense for Angular

## Usage

```html
<nb-suspense [data]="data" [loading]="loading" [error]="error">
  <ng-container *nbSuspenseIfData="let item ofType data">Data: {{ item | json }}</ng-container>
  <ng-container *nbSuspenseIfEmpty="let item ofType data">Empty: {{ item | json }}</ng-container>
  <ng-container *nbSuspenseIfLoading="let item ofType loading">Loading: {{ item | json }}</ng-container>
  <ng-container *nbSuspenseIfError="let item ofType error">Error: {{ item | json }}</ng-container>
</nb-suspense>
```
