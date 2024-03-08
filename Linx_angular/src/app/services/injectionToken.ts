import { InjectionToken } from "@angular/core";
import { SpotifyService } from "./spotify.service";

export const MY_SPOTIFYSERVICES_TOKEN = new InjectionToken<SpotifyService>('KeySpotifyServices');

