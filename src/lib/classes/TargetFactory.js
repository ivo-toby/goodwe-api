import GoodWeLogger from './GoodWeLogger';

class TargetFactory {
    #modules = [];
    #data = {};

    async loadTargets(modules) {
        const objects = modules.map(async (module) => {
            const mod = await import(`./target/${module}`);
            return mod;
        });
        const mods = await Promise.all(objects);
        this.targets = mods.map(module => new module.default()); // eslint-disable-line
        if (this.validateTargets()) {
            return true;
        }
        return false;
    }

    validateTargets() {
        try {
            this.targets.map((module) => { // eslint-disable-line
                module.validateSettings();
            });
        } catch (e) {
            GoodWeLogger.log(e);
            return false;
        }
        return true;
    }

    async syncTargets() {
        let resolved = this.#modules.map(async (module) => {
            const result = await module.sync();
            return result;
        });
        resolved = Promise.all(resolved);
        return resolved;
    }

    get powerData() {
        return this.#data;
    }

    set powerData(data) {
        this.#data = data;
        this.#modules.forEach((module) => {
            module.powerData = data; // eslint-disable-line
        });
    }

    get targets() {
        return this.#modules;
    }

    set targets(targetArray = []) {
        this.#modules = targetArray;
    }
}

export default TargetFactory;
