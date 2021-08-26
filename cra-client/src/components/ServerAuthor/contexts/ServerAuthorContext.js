/* SPDX-License-Identifier: Apache-2.0 */
/* Copyright Contributors to the ODPi Egeria project. */

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

import { IdentificationContext } from "../../../contexts/IdentificationContext";

import accessServices from "../components/defaults/accessServices";
import serverTypes from "../components/defaults/serverTypes";
import viewServices from "../components/defaults/viewServices";
import discoveryEngines from "../components/defaults/discoveryEngines";
import stewardshipEngines from "../components/defaults/stewardshipEngines";
import integrationServices from "../components/defaults/integrationServices";
import { issueRestCreate, issueRestGet, issueRestDelete } from "../../common/RestCaller";

export const ServerAuthorContext = createContext();
export const ServerAuthorContextConsumer = ServerAuthorContext.Consumer;

const ServerAuthorContextProvider = props => {

  const { userId, serverName: serverName, user } = useContext(IdentificationContext);

  // All Servers
  const [allServers, setAllServers] = useState([]);
  // supported audit log severities
  const [supportedAuditLogSeverities, setSupportedAuditLogSeverities] = useState([]);
  // Basic Config
  const [newServerName, setNewServerName] = useState("");
  const [newServerLocalURLRoot, setNewServerLocalURLRoot] = useState("https://localhost:9443");
  const [newServerLocalServerType, setNewServerLocalServerType] = useState(serverTypes[0].label);
  const [newServerOrganizationName, setNewServerOrganizationName] = useState(user ? user.organizationName || "" : "");
  const [newServerLocalUserId, setNewServerLocalUserId] = useState("");
  const [newServerLocalPassword, setNewServerLocalPassword] = useState("");
  const [newServerSecurityConnector, setNewServerSecurityConnector] = useState("");
  const [newServerRepository, setNewServerRepository] = useState("in-memory-repository");
  const [newServerMaxPageSize, setNewServerMaxPageSize] = useState(1000);
  // Access Services
  const [availableAccessServices, setAvailableAccessServices] = useState(accessServices);
  const [selectedAccessServices, setSelectedAccessServices] = useState(accessServices);
  // Cohorts
  const [newServerCohorts, setNewServerCohorts] = useState([]);
  // Archives
  const [newServerOMArchives, setNewServerOMArchives] = useState([]);
  // Proxy
  const [newServerProxyConnector, setNewServerProxyConnector] = useState("");
  const [newServerEventMapperConnector, setNewServerEventMapperConnector] = useState("");
  const [newServerEventSource, setNewServerEventSource] = useState("");
  // View Services
  const [availableViewServices, setAvailableViewServices] = useState(viewServices);
  const [selectedViewServices, setSelectedViewServices] = useState([]);
  const [newServerViewServiceRemoteServerName, setNewServerViewServiceRemoteServerName] = useState("");
  const [newServerViewServiceRemoteServerURLRoot, setNewServerViewServiceRemoteServerURLRoot] = useState("");
  // Discovery Engines
  const [availableDiscoveryEngines, setAvailableDiscoveryEngines] = useState(discoveryEngines);
  const [selectedDiscoveryEngines, setSelectedDiscoveryEngines] = useState([]);
  const [newServerDiscoveryEngineRemoteServerName, setNewServerDiscoveryEngineRemoteServerName] = useState("");
  const [newServerDiscoveryEngineRemoteServerURLRoot, setNewServerDiscoveryEngineRemoteServerURLRoot] = useState("");
  // Stewardship Engines
  const [availableStewardshipEngines, setAvailableStewardshipEngines] = useState(stewardshipEngines);
  const [selectedStewardshipEngines, setSelectedStewardshipEngines] = useState([]);
  const [newServerStewardshipEngineRemoteServerName, setNewServerStewardshipEngineRemoteServerName] = useState("");
  const [newServerStewardshipEngineRemoteServerURLRoot, setNewServerStewardshipEngineRemoteServerURLRoot] = useState("");
  // Integration Services
  const [availableIntegrationServices, setAvailableIntegrationServices] = useState(integrationServices);
  const [selectedIntegrationService, setSelectedIntegrationService] = useState("");
  const [newServerIntegrationServiceRemoteServerName, setNewServerIntegrationServiceRemoteServerName] = useState("");
  const [newServerIntegrationServiceRemoteServerURLRoot, setNewServerIntegrationServiceRemoteServerURLRoot] = useState("");
  const [newServerIntegrationServiceConnectorName, setNewServerIntegrationServiceConnectorName] = useState("");
  const [newServerIntegrationServiceConnectorUserId, setNewServerIntegrationServiceConnectorUserId] = useState("");
  const [newServerIntegrationServiceConnection, setNewServerIntegrationServiceConnection] = useState("");
  const [newServerIntegrationServiceMetadataSource, setNewServerIntegrationServiceMetadataSource] = useState("");
  const [newServerIntegrationServiceRefreshTimeInterval, setNewServerIntegrationServiceRefreshTimeInterval] = useState(60);
  const [newServerIntegrationServiceUsesBlockingCalls, setNewServerIntegrationServiceUsesBlockingCalls] = useState(false);
  const [newServerIntegrationServicePermittedSynchronization, setNewServerIntegrationServicePermittedSynchronization] = useState("BOTH_DIRECTIONS");
  // Notifications
  const [notificationType, setNotificationType] = useState("error");
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationSubtitle, setNotificationSubtitle] = useState("");
  // Progress
  const [progressIndicatorIndex, setProgressIndicatorIndex] = useState(0);
  const [loadingText, setLoadingText] = useState("Loading...");
  // Preview & Deploy
  const [newServerConfig, setNewServerConfig] = useState(null);
  const [preventDeployment, setPreventDeployment] = useState(false);

  // Refs
  const basicConfigFormStartRef = useRef(null);
  const discoveryEnginesFormStartRef = useRef(null);
  const stewardshipEnginesFormStartRef = useRef(null);
  const integrationServicesFormStartRef = useRef(null);

  useEffect(() => {
    const fetchLists = async () => {
      retrieveAllServers();
    }
    fetchLists();
  }, []);

  const retrieveAllServers = () => {
    console.log("called retrieveAllServers()");

    const restURL = encodeURI("/servers/" + serverName + "/server-author/users/" + userId + "/platforms");
    issueRestGet(restURL, onSuccessfulFetchPlatforms, onErrorFetchPlatforms, "platforms");

  }

  const onSuccessfulFetchPlatforms = (json) => {
    
    console.log("Successfully fetched platforms = " + JSON.stringify(json));
    const platforms = json.platforms;
    let serverList = [];
   
    for (var i=0;i<platforms.length;i++) {
      const platform = platforms[i];
      for (var j=0;j < platform.storedServers.length; j++) {
        let svr = {};
        const storedServer =platforms[i].storedServers[j];

        svr.serverType = storedServer.serverType; 
        svr.platformName = platform.platformName;
        svr.platformStatus = platform.platformStatus;
        svr.serverName = storedServer.storedServerName;
        svr.serverStatus = storedServer.serverStatus;
        svr.id = i + "_" + j; // note that server name is not unique - as it can exist on multiple platforms - so should not be used as the id.
        serverList.push(svr)
      }
    }
    setAllServers(serverList);
    const restURL = encodeURI("/servers/" + serverName + "/server-author/users/" + userId +"/servers/" + serverName + "/audit-log-destinations");
    issueRestGet(restURL, onSuccessfulFetchAuditLogSeverities, onErrorFetchAuditLogSeverities, "severities");
  }
  const onErrorFetchPlatforms = () => {
      // error
      setAllServers([]);
      alert("Error getting all servers"); 
  }
  const onErrorFetchAuditLogSeverities = () => {
    // error
    setSupportedAuditLogSeverities([]);
    alert("Error getting audit log supported severities"); 
  }
  const  onSuccessfulFetchAuditLogSeverities = (json) => {
    
    console.log("Successfully fetched supported sudit log severities = " + JSON.stringify(json));
    const severities = json.severities;
    setSupportedAuditLogSeverities(severities);

  }
  const fetchServerConfig = (onSuccessfulFetchServer, onErrorFetchServer ) => {
    console.log("called fetchServerConfig");
    const fetchServerConfigURL = 
    encodeURI("/servers/" + serverName + "/server-author/users/" + userId + "/servers/" + newServerName + "/configuration");
    
   
    issueRestGet(fetchServerConfigURL, onSuccessfulFetchServer, onErrorFetchServer, "omagServerConfig");
  }

  const generateBasicServerConfig = () => {

    if (!newServerName || newServerName === "") {
      throw new Error(`Cannot create OMAG server configuration without Server Name`);
    }

    if (!newServerLocalURLRoot || newServerLocalURLRoot === "") {
      throw new Error(`Cannot create OMAG server configuration without Local Server URL Root`);
    }

    if (!newServerLocalServerType || newServerLocalServerType === "") {
      throw new Error(`Cannot create OMAG server configuration without Local Server Type`);
    }

    if (!newServerOrganizationName || newServerOrganizationName === "") {
      throw new Error(`Cannot create OMAG server configuration without Organization Name`);
    }

    if (!newServerLocalUserId || newServerLocalUserId === "") {
      throw new Error(`Cannot create OMAG server configuration without Local Server User ID`);
    }

    if (!newServerLocalPassword || newServerLocalPassword === "") {
      throw new Error(`Cannot create OMAG server configuration without Local Server Password`);
    }

    return {
      "class": "OMAGServerConfig",
      "versionId": "V2.0",
      "localServerName": newServerName,
      "localServerType": newServerLocalServerType,
      "organizationName": newServerOrganizationName,
      "localServerURL": newServerLocalURLRoot,
      "localServerUserId": newServerLocalUserId,
      "localServerPassword": newServerLocalPassword,
      "maxPageSize": newServerMaxPageSize,
    }

  }

  const registerCohort = (cohortName, onSuccessfulRegisterCohort, onErrorRegisterCohort) => {
    console.log("called registerCohort", { cohortName });

    const registerCohortURL = encodeURI("/servers/" + serverName + "/server-author/users/" + userId + "/servers/" + newServerName + "/cohorts/" + cohortName);
    issueRestCreate(registerCohortURL, undefined, onSuccessfulRegisterCohort, onErrorRegisterCohort, "");
  }


  const unRegisterCohort = (cohortName, onSuccessfulUnRegisterCohort, onErrorUnRegisterCohort) => {
    console.log("called unRegisterCohort", { cohortName });

    const unRegisterCohortURL = encodeURI("/servers/" + serverName + "/server-author/users/" + userId + "/servers/" + newServerName + "/cohorts/" + cohortName);
    issueRestDelete(unRegisterCohortURL, onSuccessfulUnRegisterCohort, onErrorUnRegisterCohort);
  }

  const configureArchiveFile = (archiveName, onSuccessfulConfigureArchiveFile, onErrorConfigureArchiveFile) => {
    console.log("called configureArchive", { archiveName });
    const configureArchiveURL = encodeURI("/servers/" + serverName + "/server-author/users/" + userId + "/servers/" + newServerName + "/open-metadata-archives/file");
    issueRestGet(configureArchiveURL, onSuccessfulConfigureArchiveFile, onErrorConfigureArchiveFile, "????");
  }


  const configureRepositoryProxyConnector = async (className) => {
    console.log("called configureRepositoryProxyConnector", { className });
    if (className !== "") {
      const configureRepositoryProxyConnectorURL = `/open-metadata/admin-services/users/${userId}/servers/${newServerName}/local-repository/mode/repository-proxy/details?connectorProvider=${className}`;
      try {
        const configureRepositoryProxyConnectorURLResponse = await axios.post(configureRepositoryProxyConnectorURL, {
          serverName,
        }, {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 30000,
        });
        if (configureRepositoryProxyConnectorURLResponse.data.relatedHTTPCode !== 200) {
          throw new Error(configureRepositoryProxyConnectorURLResponse.data.exceptionErrorMessage);
        }
      } catch(error) {
        if (error.code && error.code === 'ECONNABORTED') {
          console.error("Error connecting to the platform. Please ensure the OMAG server platform is available.");
        } else {
          console.error("Error configuring repository proxy connector.", error.message);
        }
        throw error;
      }
    }
  }

  const configureRepositoryEventMapperConnector = async (className, eventSource) => {
    console.log("called configureRepositoryEventMapperConnector", { className });
    if (className !== "" && eventSource !== "") {
      const configureRepositoryEventMapperConnectorURL = `/open-metadata/admin-services/users/${userId}/servers/${newServerName}/local-repository/event-mapper-details?connectorProvider=${className}&eventSource=${eventSource}`;
      try {
        const configureRepositoryEventMapperConnectorURLResponse = await axios.post(configureRepositoryEventMapperConnectorURL, {
          serverName,
        }, {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 30000,
        });
        if (configureRepositoryEventMapperConnectorURLResponse.data.relatedHTTPCode !== 200) {
          throw new Error(configureRepositoryEventMapperConnectorURLResponse.data.exceptionErrorMessage);
        }
      } catch(error) {
        if (error.code && error.code === 'ECONNABORTED') {
          console.error("Error connecting to the platform. Please ensure the OMAG server platform is available.");
        } else {
          console.error("Error configuring repository event mapper connector.", error.message);
        }
        throw error;
      }
    }
  }

  const configureViewServices = async (remoteServerURLRoot, remoteServerName, serviceURLMarker) => {
    console.log("called configureViewServices", { serviceURLMarker });
    let configureViewServicesURL = `/open-metadata/admin-services/users/${userId}/servers/${newServerName}/view-services`;
    if (serviceURLMarker && serviceURLMarker !== "") {
      configureViewServicesURL += `/${serviceURLMarker}`;
    }
    try {
      const configureViewServicesURLResponse = await axios.post(configureViewServicesURL, {
        serverName,
        config: {
          "class": "ViewServiceConfig",
          "omagserverPlatformRootURL": remoteServerURLRoot,
          "omagserverName": remoteServerName,
        }
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000,
      });
      if (configureViewServicesURLResponse.data.relatedHTTPCode !== 200) {
        throw new Error(configureViewServicesURLResponse.data.exceptionErrorMessage);
      }
    } catch(error) {
      if (error.code && error.code === 'ECONNABORTED') {
        console.error("Error connecting to the platform. Please ensure the OMAG server platform is available.");
      } else {
        console.error("Error configuring view services.", error.message);
      }
      throw error;
    }
  }

  const configureDiscoveryEngineClient = async (remoteServerURLRoot, remoteServerName) => {
    console.log("called configureDiscoveryEngineClient", { remoteServerURLRoot, remoteServerName });
    const configureDiscoveryEngineClientURL = `/open-metadata/admin-services/users/${userId}/servers/${newServerName}/discovery-server/client-config`;
    try {
      const configureDiscoveryEngineClientURLResponse = await axios.post(configureDiscoveryEngineClientURL, {
        serverName,
        config: {
          "class": "OMAGServerClientConfig",
          "omagserverPlatformRootURL": remoteServerURLRoot,
          "omagserverName": remoteServerName,
        }
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000,
      });
      if (configureDiscoveryEngineClientURLResponse.data.relatedHTTPCode !== 200) {
        throw new Error(configureDiscoveryEngineClientURLResponse.data.exceptionErrorMessage);
      }
    } catch(error) {
      if (error.code && error.code === 'ECONNABORTED') {
        console.error("Error connecting to the platform. Please ensure the OMAG server platform is available.");
      } else {
        console.error("Error configuring discovery engine client (metadata server).", error.message);
      }
      throw error;
    }
  }

  const configureDiscoveryEngines = async (engines) => {
    console.log("called configureDiscoveryEngines", { engines });
    const configureDiscoveryEnginesURL = `/open-metadata/admin-services/users/${userId}/servers/${newServerName}/discovery-server/set-discovery-engines`;
    try {
      const configureDiscoveryEnginesURLResponse = await axios.post(configureDiscoveryEnginesURL, {
        serverName,
        config: engines,
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000,
      });
      if (configureDiscoveryEnginesURLResponse.data.relatedHTTPCode !== 200) {
        throw new Error(configureDiscoveryEnginesURLResponse.data.exceptionErrorMessage);
      }
    } catch(error) {
      if (error.code && error.code === 'ECONNABORTED') {
        console.error("Error connecting to the platform. Please ensure the OMAG server platform is available.");
      } else {
        console.error("Error configuring discovery engines.", error.message);
      }
      throw error;
    }
  }

  const configureStewardshipEngineClient = async (remoteServerURLRoot, remoteServerName) => {
    console.log("called configureStewardshipEngineClient", { remoteServerURLRoot, remoteServerName });
    const configureStewardshipEngineClientURL = `/open-metadata/admin-services/users/${userId}/servers/${newServerName}/stewardship-server/client-config`;
    try {
      const configureStewardshipEngineClientURLResponse = await axios.post(configureStewardshipEngineClientURL, {
        serverName,
        config: {
          "class": "OMAGServerClientConfig",
          "omagserverPlatformRootURL": remoteServerURLRoot,
          "omagserverName": remoteServerName,
        }
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000,
      });
      if (configureStewardshipEngineClientURLResponse.data.relatedHTTPCode !== 200) {
        throw new Error(configureStewardshipEngineClientURLResponse.data.exceptionErrorMessage);
      }
    } catch(error) {
      if (error.code && error.code === 'ECONNABORTED') {
        console.error("Error connecting to the platform. Please ensure the OMAG server platform is available.");
      } else {
        console.error("Error configuring stewardship engine client (metadata server).", error.message);
      }
      throw error;
    }
  }

  const configureStewardshipEngines = async (engines) => {
    console.log("called configureStewardshipEngines", { engines });
    const configureStewardshipEnginesURL = `/open-metadata/admin-services/users/${userId}/servers/${newServerName}/stewardship-server/set-stewardship-engines`;
    try {
      const configureStewardshipEnginesURLResponse = await axios.post(configureStewardshipEnginesURL, {
        serverName,
        config: engines,
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000,
      });
      if (configureStewardshipEnginesURLResponse.data.relatedHTTPCode !== 200) {
        throw new Error(configureStewardshipEnginesURLResponse.data.exceptionErrorMessage);
      }
    } catch(error) {
      if (error.code && error.code === 'ECONNABORTED') {
        console.error("Error connecting to the platform. Please ensure the OMAG server platform is available.");
      } else {
        console.error("Error configuring stewardship engines.", error.message);
      }
      throw error;
    }
  }

  const serverConfigurationSteps = (serverType) => {

    const steps = [
      "Select server type",
      "Basic configuration",
      "Configure audit log destinations",
      "Preview configuration and deploy instance"
    ];

    switch(serverType) {

      case "View Server":
        steps.splice(steps.length - 1, 0, "Configure the Open Metadata View Services (OMVS)");
        break;

      case "Metadata Access Point":
      case "Metadata Server":
        steps.splice(2, 0, "Select access services");
        steps.splice(steps.length - 1, 0, "Register to a cohort");
        steps.splice(steps.length - 1, 0, "Configure the open metadata archives");
        break;

      case "Repository Proxy":
        steps.splice(steps.length - 1, 0, "Register to a cohort");
        steps.splice(steps.length - 1, 0, "Configure the open metadata archives");
        steps.splice(steps.length - 1, 0, "Configure the repository proxy connectors");
        break;

      case "Conformance Test Server":
        steps.splice(steps.length - 1, 0, "Register to a cohort");
        break;

      case "Integration Daemon":
        steps.splice(steps.length - 1, 0, "Configure the Open Metadata Integration Services (OMIS)");
        break;

    }

    return steps;

  }

  const setServerAttribute = async (attrEndpoint, value) => {
    console.log("called setServerAttribute", { attrEndpoint, value });
    const setServerAttrURL = `/open-metadata/admin-services/users/${userId}/servers/${newServerName}/${attrEndpoint}=${value}`;
    try {
      const setServerAttrResponse = await axios.post(setServerAttrURL, {
        serverName,
      }, {
        timeout: 30000,
      });
      if (setServerAttrResponse.data.relatedHTTPCode !== 200) {
        throw new Error("Error in setServerAttrResponse");
      }
    } catch(error) {
      if (error.code && error.code === 'ECONNABORTED') {
        console.error("Error connecting to the platform. Please ensure the OMAG server platform is available.");
      } else {
        console.error("Error configuring/updating property of OMAG Server", { error });
      }
      throw error;
    }
  }

  const setServerConfig = (serverConfig) => {
    const serverConfigURL = encodeURI("/servers/" + serverName + "/server-author/users/" + userId + "/servers/" + newServerName + "/configuration");
    issueRestCreate(serverConfigURL, serverConfig, onSuccessfulSetServer, onErrorSetServer, "omagserverConfig");
  }
 const onSuccessfulSetServer = (json) =>{
   const serverConfig = json.omagserverConfig;
   setNewServerConfig(serverConfig);
 }
 const onErrorSetServer = (error) => {
  alert("Error setting the server config"); 
 }

   
 const showConfigForm = () => {
    document.getElementById("server-list-container").style.display = "none";
    document.getElementById("server-config-container").style.display = "flex";
 }

  const hideConfigForm = () => {
    document.getElementById("server-list-container").style.display = "flex";
    document.getElementById("server-config-container").style.display = "none";
    for (let el of document.querySelectorAll('.hideable')) el.style.display = 'none';
    document.getElementById("server-type-container").style.display = "block";
    setProgressIndicatorIndex(0);
  }


  return (
    <ServerAuthorContext.Provider
      value={{
        // States
        allServers, setAllServers,
        supportedAuditLogSeverities,    // we do not need expose the set as it is only referenced in this context code.
        newServerName, setNewServerName,
        newServerLocalURLRoot, setNewServerLocalURLRoot,
        newServerLocalServerType, setNewServerLocalServerType,
        newServerOrganizationName, setNewServerOrganizationName,
        newServerLocalUserId, setNewServerLocalUserId,
        newServerLocalPassword, setNewServerLocalPassword,
        newServerSecurityConnector, setNewServerSecurityConnector,
        newServerRepository, setNewServerRepository,
        newServerMaxPageSize, setNewServerMaxPageSize,
        availableAccessServices, setAvailableAccessServices,
        selectedAccessServices, setSelectedAccessServices,
        newServerCohorts, setNewServerCohorts,
        newServerOMArchives, setNewServerOMArchives,
        newServerProxyConnector, setNewServerProxyConnector,
        newServerEventMapperConnector, setNewServerEventMapperConnector,
        newServerEventSource, setNewServerEventSource,
        availableViewServices, setAvailableViewServices,
        selectedViewServices, setSelectedViewServices,
        newServerViewServiceRemoteServerName, setNewServerViewServiceRemoteServerName,
        newServerViewServiceRemoteServerURLRoot, setNewServerViewServiceRemoteServerURLRoot,
        availableDiscoveryEngines, setAvailableDiscoveryEngines,
        selectedDiscoveryEngines, setSelectedDiscoveryEngines,
        newServerDiscoveryEngineRemoteServerName, setNewServerDiscoveryEngineRemoteServerName,
        newServerDiscoveryEngineRemoteServerURLRoot, setNewServerDiscoveryEngineRemoteServerURLRoot,
        availableStewardshipEngines, setAvailableStewardshipEngines,
        selectedStewardshipEngines, setSelectedStewardshipEngines,
        newServerStewardshipEngineRemoteServerName, setNewServerStewardshipEngineRemoteServerName,
        newServerStewardshipEngineRemoteServerURLRoot, setNewServerStewardshipEngineRemoteServerURLRoot,
        availableIntegrationServices, setAvailableIntegrationServices,
        selectedIntegrationService, setSelectedIntegrationService,
        newServerIntegrationServiceRemoteServerName, setNewServerIntegrationServiceRemoteServerName,
        newServerIntegrationServiceRemoteServerURLRoot, setNewServerIntegrationServiceRemoteServerURLRoot,
        newServerIntegrationServiceConnectorName, setNewServerIntegrationServiceConnectorName,
        newServerIntegrationServiceConnectorUserId, setNewServerIntegrationServiceConnectorUserId,
        newServerIntegrationServiceConnection, setNewServerIntegrationServiceConnection,
        newServerIntegrationServiceMetadataSource, setNewServerIntegrationServiceMetadataSource,
        newServerIntegrationServiceRefreshTimeInterval, setNewServerIntegrationServiceRefreshTimeInterval,
        newServerIntegrationServiceUsesBlockingCalls, setNewServerIntegrationServiceUsesBlockingCalls,
        newServerIntegrationServicePermittedSynchronization, setNewServerIntegrationServicePermittedSynchronization,
        notificationType, setNotificationType,
        notificationTitle, setNotificationTitle,
        notificationSubtitle, setNotificationSubtitle,
        progressIndicatorIndex, setProgressIndicatorIndex,
        loadingText, setLoadingText,
        newServerConfig, setNewServerConfig,
        preventDeployment, setPreventDeployment,
        // Refs
        basicConfigFormStartRef,
        discoveryEnginesFormStartRef,
        stewardshipEnginesFormStartRef,
        integrationServicesFormStartRef,
        // Functions
  
        retrieveAllServers,
        fetchServerConfig,
        generateBasicServerConfig,
        // configureAccessServices,
        registerCohort,
        unRegisterCohort,
        configureArchiveFile,
        configureRepositoryProxyConnector,
        configureRepositoryEventMapperConnector,
        configureViewServices,
        configureDiscoveryEngineClient,
        configureDiscoveryEngines,
        configureStewardshipEngineClient,
        configureStewardshipEngines,
        serverConfigurationSteps,
        setServerAttribute,
        setServerConfig,
        showConfigForm,
        hideConfigForm,
      }}
    >
      {props.children}
    </ServerAuthorContext.Provider>
  );

};

ServerAuthorContextProvider.propTypes = {
  children: PropTypes.node
};

export default ServerAuthorContextProvider;