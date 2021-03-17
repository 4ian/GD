// @flow
import optionalRequire from '../Utils/OptionalRequire.js';
const electron = optionalRequire('electron');
const path = optionalRequire('path');

class UrlsCache {
  projectCache: { [number]: { [string]: string } } = {};

  _getProjectCache(project: gdProject) {
    const cache = this.projectCache[project.ptr];
    if (!cache) {
      return (this.projectCache[project.ptr] = {});
    }

    return cache;
  }

  getCachedUrl(project: gdProject, filename: string): ?string {
    const cache = this._getProjectCache(project);
    if (!cache[filename]) return;
    return cache[filename]['systemFilename'];
  }

  cacheUrl(project: gdProject, url: string): string {
    const cache = this._getProjectCache(project);
    return (cache[url] = url);
  }

  burstUrl(project: gdProject, url: string) {
    const cache = this._getProjectCache(project);
    delete cache[url];
  }

  cacheLocalFileUrl(
    project: gdProject,
    filename: string,
    systemFilename: string,
    disableCacheBurst: boolean
  ): string {
    const cache = this._getProjectCache(project);
    cache[filename] = {};
    if (!disableCacheBurst) {
      // The URL is cached with an extra "cache-bursting" parameter.
      // If the cache is emptied or changed, local files will have another
      // value for this parameter, forcing the browser to reload the images.
      return (cache[filename][
        'systemFilename'
      ] = `${systemFilename}?cache=${Date.now()}`);
    } else {
      return (cache[filename]['systemFilename'] = systemFilename);
    }
  }

  getStatusCode(project: gdProject, filename: string) {
    const cache = this._getProjectCache(project);
    if (!cache[filename]) return;
    return cache[filename]['statusCode'] || '';
  }

  setStatusCode(project: gdProject, filename: string, statusCode: string) {
    const cache = this._getProjectCache(project);
    if (!cache[filename]) return;
    return (cache[filename]['statusCode'] = statusCode);
  }
}

type LoadingOptions = {|
  disableCacheBurst?: boolean,
  isResourceForPixi?: boolean,
|};

const addSearchParameterToUrl = (
  url: string,
  urlEncodedParameterName: string,
  urlEncodedValue: string
) => {
  const separator = url.indexOf('?') === -1 ? '?' : '&';
  return url + separator + urlEncodedParameterName + '=' + urlEncodedValue;
};

const isLocalFile = (urlOrFilename: string) => {
  return (
    urlOrFilename.indexOf('data:') !== 0 &&
    urlOrFilename.indexOf('http://') !== 0 &&
    urlOrFilename.indexOf('https://') !== 0 &&
    urlOrFilename.indexOf('ftp://') !== 0
  );
};

/**
 * A class globally used in the whole IDE to get URLs to resources of games
 * (notably images).
 */
export default class ResourcesLoader {
  static _cache = new UrlsCache();

  /**
   * Remove the specified resources resolved URLs from the cache. Useful if the
   * file represented by these resources has changed. This force these local files to be loaded again.
   */
  static burstUrlsCacheForResources(
    project: gdProject,
    resourcesNames: Array<string>
  ) {
    const resourcesManager = project.getResourcesManager();
    if (!resourcesNames) return;
    resourcesNames.forEach(resourceName => {
      if (resourcesManager.hasResource(resourceName)) {
        ResourcesLoader._cache.burstUrl(
          project,
          resourcesManager.getResource(resourceName).getFile()
        );
      }
    });
  }

  /**
   * Re-create a new cache for URLs. Call this to force local
   * file to be loaded again.
   */
  static burstAllUrlsCache() {
    ResourcesLoader._cache = new UrlsCache();
  }

  /**
   * Get the fully qualified URL/filename for a URL/filename relative to the project.
   */
  static getFullUrl(
    project: gdProject,
    urlOrFilename: string,
    { isResourceForPixi, disableCacheBurst }: LoadingOptions
  ): string {
    if (!!electron && isLocalFile(urlOrFilename)) {
      const cachedUrl = ResourcesLoader._cache.getCachedUrl(
        project,
        urlOrFilename
      );
      if (cachedUrl) return cachedUrl;

      // Support local filesystem with Electron
      const file = project.getProjectFile();
      const projectPath = path.dirname(file);
      const resourceAbsolutePath = path
        .resolve(projectPath, urlOrFilename)
        .replace(/\\/g, '/');

      console.info('Caching resolved local filename:', resourceAbsolutePath);

      /*
      TODO here add an trigger for check the resource and give him a status if needed,
      depending of their dimension for example.
      Wrap the trigger in an condition driven by the preferences option of this features.
      */
      return this._cache.cacheLocalFileUrl(
        project,
        urlOrFilename,
        'file://' + resourceAbsolutePath,
        !!disableCacheBurst
      );
    }

    let urlWithParameters = urlOrFilename;
    if (isResourceForPixi) {
      // To avoid strange/hard to understand CORS issues, we add a dummy parameter.
      // By doing so, we force browser to consider this URL as different than the one traditionally
      // used to render the resource in the editor (usually as an `<img>` or as a background image).
      // If we don't add this distinct parameter, it can happen that browsers fail to load the image
      // as it's already in the **browser cache** but with slightly different request parameters -
      // making the CORS checks fail (even if it's coming from the browser cache).
      //
      // It's happening sometimes (according to loading order probably) in Chrome and (more often)
      // in Safari. It might be linked to Amazon S3 + CloudFront that "doesn't support the Vary: Origin header".
      // To be safe, we entirely avoid the issue with this parameter, making the browsers consider
      // the resources for use in Pixi.js and for the rest of the editor as entirely separate.
      //
      // See:
      // - https://stackoverflow.com/questions/26140487/cross-origin-amazon-s3-not-working-using-chrome
      // - https://stackoverflow.com/questions/20253472/cors-problems-with-amazon-s3-on-the-latest-chomium-and-google-canary
      // - https://stackoverflow.com/a/20299333
      //
      // Search for "cors-cache-workaround" in the codebase for the same workarounds.
      urlWithParameters = addSearchParameterToUrl(
        urlWithParameters,
        'gdUsage', // Arbitrary parameter name to designate that this is being used for Pixi.js
        'pixi'
      );
    }

    const cachedUrl = ResourcesLoader._cache.getCachedUrl(
      project,
      urlWithParameters
    );
    if (cachedUrl) return cachedUrl;

    console.info('Caching resolved url:', urlWithParameters);
    return this._cache.cacheUrl(project, urlWithParameters);
  }

  /**
   * Get the fully qualified URL/filename associated with the given resource, with potential
   * changes to accomodate browsers CORS/cache.
   */
  static getResourceFullUrl(
    project: gdProject,
    resourceName: string,
    options: LoadingOptions
  ) {
    if (project.getResourcesManager().hasResource(resourceName)) {
      const resourceRelativePath = project
        .getResourcesManager()
        .getResource(resourceName)
        .getFile();
      return ResourcesLoader.getFullUrl(project, resourceRelativePath, options);
    }

    return resourceName;
  }
  /*
    Can be: 
    WARNING_IMAGE_EXCEEDED_2048_PIXELS


  */
  static getStatusCode(project: gdProject, resourceName: string) {
    return this._cache.getStatusCode(project, resourceName);
  }

  static setStatusCode(
    project: gdProject,
    resourceName: string,
    statusCode: string
  ) {
    this._cache.setStatusCode(project, resourceName, statusCode);
  }

  /*
  Remove the file in the cache for refresh the image in the IDE
  */
  static burstUrl(project: gdProject, url: string) {
    this._cache.burstUrl(project, url);
  }
}
