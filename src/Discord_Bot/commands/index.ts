import * as setup_clan from './setupClan.js';
import * as get_raid_fails from './getRaidFails.js';
import * as get_current_raid_stats from './getCurrentRaidStats.js';
import * as raid_service_post from './raidServicePost.js';
import * as open_raid_post from './openRaidPost.js';

export const commands = {
    setup_clan,
    get_raid_fails,
    get_current_raid_stats,
    raid_service_post,
    open_raid_post, 
};
