/*
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
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.apache.ambari.server.serveraction.kerberos;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

/**
 * KerberosActionDataFileBuilder is an implementation of a KerberosActionDataFile that is used to
 * create a new KerberosActionDataFile.
 * <p/>
 * This class encapsulates a {@link org.apache.commons.csv.CSVPrinter} to create a CSV-formatted file.
 */
public class KerberosActionDataFileBuilder implements KerberosActionDataFile {

  private File file;
  private CSVPrinter csvPrinter;

  /**
   * Creates a new KerberosActionDataFileBuilder
   * <p/>
   * The file is opened upon creation, so there is no need to manually open it unless manually
   * closed before using.
   *
   * @param file a File declaring where to write the data
   * @throws IOException
   */
  public KerberosActionDataFileBuilder(File file) throws IOException {
    this.file = file;
    open();
  }


  /**
   * Opens the data file for writing.
   * <p/>
   * This may be called multiple times and the appropriate action will occur depending on if the
   * file has been previously opened or closed.
   *
   * @throws IOException
   */
  public void open() throws IOException {
    if (isClosed()) {
      if (file == null) {
        throw new IOException("Missing file path");
      } else {
        // If the file is empty, write the header; else don't write the header.
        boolean writeHeader = file.length() == 0;

        csvPrinter = new CSVPrinter(new FileWriter(file, true), CSVFormat.DEFAULT);

        if (writeHeader) {
          // Write the header....
          csvPrinter.printRecord(HOSTNAME,
              SERVICE,
              COMPONENT,
              PRINCIPAL,
              PRINCIPAL_CONFIGURATION,
              KEYTAB_FILE_PATH,
              KEYTAB_FILE_OWNER_NAME,
              KEYTAB_FILE_OWNER_ACCESS,
              KEYTAB_FILE_GROUP_NAME,
              KEYTAB_FILE_GROUP_ACCESS,
              KEYTAB_FILE_CONFIGURATION);
        }
      }
    }
  }

  /**
   * Tests this KerberosActionDataFileBuilder to see if the data file is closed.
   *
   * @return true if closed; otherwise false
   */
  public boolean isClosed() {
    return csvPrinter == null;
  }

  /**
   * Closes the data file
   *
   * @throws IOException
   */
  public void close() throws IOException {
    if (csvPrinter != null) {
      csvPrinter.close();
      csvPrinter = null;
    }
  }

  /**
   * Appends a new record to the data file
   *
   * @param hostName                a String containing the hostname column data
   * @param serviceName             a String containing the service name column data
   * @param serviceComponentName    a String containing the component name column data
   * @param principal               a String containing the (raw, non-evaluated) principal "pattern"
   *                                column data
   * @param principalConfiguration  a String containing the principal's configuration property column data
   *                                (expected to be the type and name of the configuration property
   *                                to use to store the evaluated principal data in
   *                                - i.e., config-type/property)
   * @param keytabFilePath          a String containing the destination keytab file path column data
   * @param keytabFileOwnerName     a String containing the keytab file owner name column data
   * @param keytabFileOwnerAccess   a String containing the keytab file owner access column data
   *                                (expected to be "r" or "rw")
   * @param keytabFileGroupName     a String containing the keytab file group name column data
   * @param keytabFileGroupAccess   a String containing the keytab file group access column data
   *                                (expected to be "r", "rw", or "")
   * @param keytabFileConfiguration a String containing the keytab's configuration property column data
   *                                (expected to be the type and name of the configuration property
   *                                to use to store the keytab file's absolute path in
   *                                - i.e., config-type/property)
   * @throws IOException
   */
  public void addRecord(String hostName, String serviceName, String serviceComponentName,
                        String principal, String principalConfiguration, String keytabFilePath,
                        String keytabFileOwnerName, String keytabFileOwnerAccess,
                        String keytabFileGroupName, String keytabFileGroupAccess,
                        String keytabFileConfiguration) throws IOException {

    if (csvPrinter == null) {
      throw new IOException("Data file is not open");
    }

    csvPrinter.printRecord(hostName,
        serviceName,
        serviceComponentName,
        principal,
        principalConfiguration,
        keytabFilePath,
        keytabFileOwnerName,
        keytabFileOwnerAccess,
        keytabFileGroupName,
        keytabFileGroupAccess,
        keytabFileConfiguration);
  }

}
