import Config from './../Config';
import GoodWeError from './../GoodWeError';
/**
 * Acts as  abstract class for modules
 */
class AbstractTarget {
    constructor() {
        this.data = {};
    }

    validateSettings() {
        const invalid = this.settings.filter((setting) => {
            if (!Config().hasKey(setting)) {
                return setting;
            }
        });
        if (invalid.length > 0) {
            throw new GoodWeError({
                message: `Missing settings ${invalid.join(',')}`,
                code: 99,
            });
        }
        return true;
    }

    async sync() {
        return new GoodWeError({
            message: ' I have not been implemented',
            code: 99,
        });
    }

    set powerData(data) {
        this.data = data;
    }

    get powerData() {
        return this.data;
    }

    get latest() {
        if (this.data.pacs && this.data.pacs.length > 2) {
            return this.data.pacs[this.data.pacs.length - 2].pac;
        }
        return 0;
    }

    get total() {
        return this.data.today_power;
    }

}

export default AbstractTarget;
