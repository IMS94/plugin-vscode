'use strict';
/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 */
import * as fs from "fs";
import * as http from 'http';
import * as path from 'path';
import { BallerinaProject } from "src/core";
import { runCommand, BALLERINA_COMMANDS } from '../../src/project/cli-cmds/cmd-runner';
import { delay, killPort } from '../test-util';

const PROJECT_ROOT = path.join(__dirname, '..', '..', '..', 'test', 'data');

suite("Ballerina Extension CLI Command Tests", () => {

    test("Test Doc - Ballerina project", (done) => {
        const projectPath = path.join(PROJECT_ROOT, 'helloPackage');
        const balProject: BallerinaProject = {
            path: projectPath,
            version: '0.0.1',
            packageName: 'helloproject'
        };

        fs.watch(projectPath, () => {
            fs.unwatchFile(projectPath);
            done();
        });
        runCommand(balProject, BALLERINA_COMMANDS.DOC, projectPath);
        delay(5000);
    }).timeout(15000);

    test("Test Build - Ballerina project", (done) => {
        const projectPath = path.join(PROJECT_ROOT, 'helloServicePackage');
        const balProject: BallerinaProject = {
            path: projectPath,
            version: '0.0.1',
            packageName: 'helloserviceproject'
        };

        fs.watch(projectPath, () => {
            fs.unwatchFile(projectPath);
            done();
        });
        runCommand(balProject, BALLERINA_COMMANDS.BUILD, projectPath);
        delay(5000);
    }).timeout(15000);

    test("Test Run - Ballerina project", (done) => {
        const projectPath = path.join(PROJECT_ROOT, 'helloServicePackage');
        const balProject: BallerinaProject = {
            path: projectPath,
            version: '0.0.1',
            packageName: 'helloserviceproject'
        };

        runCommand(balProject, BALLERINA_COMMANDS.RUN, projectPath);
        delay(5000);
        const response = http.get('http://0.0.0.0:9091/hello/sayHello');
        if (response) {
            done();
        }
        killPort(9091);
    }).timeout(15000);

    test("Test Run - Single file", (done) => {
        const filePath = path.join(PROJECT_ROOT, 'hello_world_service.bal');
        runCommand(PROJECT_ROOT, BALLERINA_COMMANDS.RUN, filePath);
        delay(5000);
        const response = http.get('http://0.0.0.0:9090/hello/sayHello');
        if (response) {
            done();
        }
        killPort(9090);
    }).timeout(15000);
});