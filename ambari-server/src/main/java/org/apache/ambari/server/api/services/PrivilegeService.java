/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing privileges and
 * limitations under the License.
 */

package org.apache.ambari.server.api.services;

import org.apache.ambari.server.api.resources.ResourceInstance;

import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;


/**
 * Service responsible for privilege requests.
 */
public abstract class PrivilegeService extends BaseService {

  /**
   * Handles: GET /privileges/{privilegeID}
   * Get a specific privilege.
   *
   * @param headers        http headers
   * @param ui             uri info
   * @param privilegeId   privilege id
   *
   * @return privilege instance representation
   */
  @GET
  @Path("{privilegeId}")
  @Produces("text/plain")
  public Response getPrivilege(@Context HttpHeaders headers, @Context UriInfo ui,
                                @PathParam("privilegeId") String privilegeId) {

    return handleRequest(headers, null, ui, Request.Type.GET, createPrivilegeResource(privilegeId));
  }

  /**
   * Handles: GET  /privileges
   * Get all privileges.
   *
   * @param headers  http headers
   * @param ui       uri info
   *
   * @return privilege collection representation
   */
  @GET
  @Produces("text/plain")
  public Response getPrivileges(@Context HttpHeaders headers, @Context UriInfo ui) {
    return handleRequest(headers, null, ui, Request.Type.GET, createPrivilegeResource(null));
  }

  /**
   * Handles: POST /privileges
   * Create a privilege.
   *
   * @param headers    http headers
   * @param ui         uri info
   *
   * @return information regarding the created privilege
   */
  @POST
  @Produces("text/plain")
  public Response createPrivilege(String body, @Context HttpHeaders headers, @Context UriInfo ui) {

    return handleRequest(headers, body, ui, Request.Type.POST, createPrivilegeResource(null));
  }

  /**
   * Handles: PUT /privileges/{privilegeID}
   * Update a specific privilege.
   *
   * @param headers   http headers
   * @param ui        uri info
   * @param privilegeId  privilege id
   *
   * @return information regarding the updated privilege
   */
  @PUT
  @Path("{privilegeId}")
  @Produces("text/plain")
  public Response updatePrivilege(String body, @Context HttpHeaders headers, @Context UriInfo ui,
                                   @PathParam("privilegeId") String privilegeId) {

    return handleRequest(headers, body, ui, Request.Type.PUT, createPrivilegeResource(privilegeId));
  }

  /**
   * Handles: DELETE /privileges
   * Delete privileges.
   *
   * @param headers   http headers
   * @param ui        uri info
   *
   * @return information regarding the deleted privileges
   */
  @DELETE
  @Produces("text/plain")
  public Response deletePrivileges(@Context HttpHeaders headers, @Context UriInfo ui) {

    return handleRequest(headers, null, ui, Request.Type.DELETE, createPrivilegeResource(null));
  }

  /**
   * Handles: DELETE /privileges/{privilegeID}
   * Delete a specific privilege.
   *
   * @param headers   http headers
   * @param ui        uri info
   * @param privilegeId  privilege id
   *
   * @return information regarding the deleted privilege
   */
  @DELETE
  @Path("{privilegeId}")
  @Produces("text/plain")
  public Response deletePrivilege(@Context HttpHeaders headers, @Context UriInfo ui,
                                  @PathParam("privilegeId") String privilegeId) {

    return handleRequest(headers, null, ui, Request.Type.DELETE, createPrivilegeResource(privilegeId));
  }


  // ----- PrivilegeService --------------------------------------------------

  /**
   * Create a privilege resource.
   *
   * @param privilegeId privilege name
   *
   * @return a privilege resource instance
   */
  protected abstract ResourceInstance createPrivilegeResource(String privilegeId);
}