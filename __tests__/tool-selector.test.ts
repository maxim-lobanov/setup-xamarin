import * as fs from 'fs';

describe('getAllVersions', () => {
    let fsReadDirSpy: jest.SpyInstance;

    beforeEach(() => {
        fsReadDirSpy = jest.spyOn(fs, 'readdirSync');
        fsReadDirSpy.mockImplementation(() => [
            
        ]);
    });

    afterEach(() => {
        jest.resetAllMocks();
        jest.clearAllMocks();
    });
});