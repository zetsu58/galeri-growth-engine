import {test,expect} from '@playwright/test';
test('dashboard demonstrates primary sales flow',async({page})=>{await page.goto('/');await expect(page.getByRole('heading',{name:'Satış Kokpiti'})).toBeVisible();await expect(page.getByRole('button',{name:/AI ile Sat/})).toBeVisible();await expect(page.getByText('WhatsApp Müşterisi')).toBeVisible();await expect(page.getByText('92')).toBeVisible();});
