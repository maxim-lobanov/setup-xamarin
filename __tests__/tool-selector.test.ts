import * as fs from 'fs';
import { XamarinIosToolSelector } from '../src/xamarin-ios-selector';

jest.mock('fs');

describe('getAllVersions', () => {
    let fsReadDirSpy: jest.SpyInstance;

    beforeEach(() => {
        fsReadDirSpy = jest.spyOn(fs, 'readdirSync');
        fsReadDirSpy.mockImplementation((path) => [
            '13.10',
            '13.10.0.21',
            '13.4',
            '13.4.0.2',
            '13.6',
            '13.6.0.12',
            '13.8',
            '13.8.3.0',
            'third_party_folder',
            'Current',
            'Latest'
        ]);
    });

    afterEach(() => {
        jest.resetAllMocks();
        jest.clearAllMocks();
    });

    it('versions are filtered correctly', () => {
        const selector = new XamarinIosToolSelector();
        const expectedVersions = [
            '13.4',
            '13.4.0.2',
            '13.6',
            '13.6.0.12',
            '13.8',
            '13.8.3.0',
            '13.10',
            '13.10.0.21',
        ];
        expect(selector.getAllVersions()).toEqual(expectedVersions);
    });
});