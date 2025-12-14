import { Page } from '@playwright/test';
import { AlloBasePage } from './allo-base.page';

export class AlloPage extends AlloBasePage {
    public constructor(page: Page) {
        super(page);
    }
}
