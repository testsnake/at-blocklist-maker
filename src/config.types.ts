export interface userConfigInterface {
    lists: ListFilter[];
}

/** Configuration for managing Bluesky user lists */
export interface ListFilter {
    /** Unique identifier for this list */
    listId: string;
    /** Users to be included in the list */
    includedUsers?: ListIdentifiers[]; // It's an array in case of weird edge cases, shhhh
    /** Users to be explicitly excluded from the list */
    excludedUsers?: ListIdentifiers[];
}

export interface ListIdentifiers {
    /**
     * Require all identifiers to match
     *
     * @default false
     * 
     * @todo impliment checking
     */
    requireAll?: boolean;


    // Profile Data - Included with ProfileView and sometimes ProfileViewBasic

    /**
     * Domains to include, such as 'bsky.social'
     * 
     * @todo impliment function for searching
     */
    userHandleDomain?: string[];
    /**
     * Regex patterns for user handles
     * 
     * @todo impliment function for searching
     */
    userHandleRegex?: RegExp[];
    /**
     * Hashtags in profile description
     * Do not include the # symbol
     * 
     * @todo impliment function for searching
     * @remarks Requires getting full profile view, may result in faster rate limiting
     */
    userProfileHashtags?: string[];
    /**
     * Regex patterns for profile descriptions
     * 
     * @todo impliment function for searching
     */
    userProfileDescriptionRegex?: RegExp[];
    /**
     * Regex patterns for display name
     *
     * @todo impliment function for searching 
     */
    userDisplayNameRegex?: RegExp[];

    // ViewerState - Relationship with the user.
    // "You" refers to the currently logged in account.

    /**
     * User has been muted
     * 
     * @todo impliment function for searching
     * @remarks in theory this will never show up without searching
     */
    userMutedBySelf?: boolean;
    
    /**
     * User has been muted by a list you use
     * 
     * @todo impliment function for searching
     * @remarks in theory this will never show up without searching
     */
    userMutedBylist?: boolean;

    /**
     * User blocks you
     * 
     * @remarks No clue if this actually works
     */
    userBlocksSelf?: boolean;

     /**
     * User has been blocked
     * 
     * @todo impliment function for searching
     * @remarks in theory this will never show up without searching
     */
     userBlockedBySelf?: boolean;
    
     /**
      * User has been blocked by a list you use
      * 
      * @todo impliment function for searching
      * @remarks in theory this will never show up without searching
      */
     userBlockedBylist?: boolean;

     /**
      * You are following user
      */
     userFollowedBySelf?: boolean;

     /**
      * User is following you
      */
     UserFollowingSelf?: boolean;

     /**
      * Minimum amount of known followers
      */
     userMinKnownFollowers?: number;

     /**
      * Maximum amount of known followers
      */
     userMaxKnownFollowers?: number;

     /**
      * Users who you follow, that follow the users
      */
     userKnownFollowersByDid?: string[];

    // Skeet matching - Currently unimplimented due to complexity

    /**
     * Regex patterns for words in the users Skeets
     *
     * @todo impliment function for searching, verifying
     * @remarks WARNING: WILL BE RESOURCE INTENSIVE
     */
    userWordsUsedInSkeetsRegex?: RegExp[];
    /**
     * Hastags in users Skeets
     *
     * @todo impliment function for searching, verifying
     * @remarks WARNING: WILL BE RESOURCE INTENSIVE
     */
    userHashtagsUsedInSkeets?: string[];
    /**
     * Regex pattern for hastags in users Skeets
     *
     * @todo impliment function for searching, verifying
     * @remarks WARNING: WILL BE RESOURCE INTENSIVE
     */
    userHashtagsUsedInSkeetsRegex?: RegExp[];

    // User follows/blocks - Currently unimplimented

    /**
     * User follows by DID
     * 
     * @todo impliment function for searching, verifying
     */
    userFollows?: string[];
    /** 
     * User blocks by DID
     * 
     * @todo impliment function for searching, verifying
     */
    userBlocks?: string[];

    // ProfileAssociated - Will not impliment
}
