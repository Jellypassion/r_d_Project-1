import { Page } from 'playwright';
import { AlloBasePage } from './allo-base.page.ts';

export class AlloPage extends AlloBasePage {
    public constructor(page: Page) {
        super(page);
    }
}
