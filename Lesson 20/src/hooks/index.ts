
import { browserHook } from './browser.hook.ts';
import { globalContextHook } from './global-context.hook.ts';
import { pageHook } from './page.hook.ts';
import { browserContextHook } from './context.hook.ts';
import { attachResultsHook } from './attach-result.hook.ts';

globalContextHook();
browserHook();
browserContextHook();
pageHook();
attachResultsHook();
