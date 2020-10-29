import React from 'react';
import { Select, Button, Input, InputNumber } from 'antd';
import { pure } from 'recompose';
import { CloseOutlined } from '@ant-design/icons';
import {ProjectFieldWithGradeInfoType} from "../../types/Student";

const { Option } = Select;
interface Props {
    project: ProjectFieldWithGradeInfoType;
    changeProjectRange: (
        project: ProjectFieldWithGradeInfoType,
        [min, max]: [number | undefined, number | undefined]
    ) => void;
    changeProjectName: (project: ProjectFieldWithGradeInfoType, newProject: string) => void;
    options: string[];
    removeProject: (project: ProjectFieldWithGradeInfoType) => void;
}
const ProjectItem = ({
                         project,
                         changeProjectRange,
                         changeProjectName,
                         options,
                         removeProject,
                     }: Props) => {
    return (
        <div
            key={project.name}
            style={{ display: 'flex', width: '100%', marginTop: '8px' }}
        >
            <Input.Group compact>
                <Select
                    key={`${project.name}-input`}
                    onChange={(value) => changeProjectName(project, value)}
                    defaultValue={project.name}
                    style={{ width: 120 }}
                >
                    {options.map((project) => {
                        return (
                            <Option key={project} value={project}>
                                {project}
                            </Option>
                        );
                    })}
                </Select>
                <InputNumber
                    key={`${project.name}-min`}
                    style={{
                        width: 60,
                        marginLeft: '8px',
                        textAlign: 'center',
                    }}
                    value={project.min}
                    max={project.max ? project.max + 1 : 13}
                    min={1}
                    placeholder="Minimum"
                    onChange={(v) => {
                        if (v) {
                            changeProjectRange(project, [v, project.max]);
                        }
                    }}
                />
                <Input
                    className="site-input-split"
                    style={{
                        width: 30,
                        borderLeft: 0,
                        borderRight: 0,
                        zIndex: 2,
                        pointerEvents: 'none',
                    }}
                    placeholder="~"
                    disabled
                />
                <InputNumber
                    key={`${project.name}-max`}
                    className="site-input-right"
                    value={project.max}
                    min={project.min ? project.min : 1}
                    max={13}
                    onChange={(v) => {
                        if (v) {
                            changeProjectRange(project, [project.min, v]);
                        }
                    }}
                    style={{
                        width: 60,
                        textAlign: 'center',
                    }}
                    placeholder="Maximum"
                />
            </Input.Group>

            <Button
                icon={<CloseOutlined />}
                style={{ margin: 0, width: '40px' }}
                onClick={() => removeProject(project)}
            />
        </div>
    );
};

export default pure(ProjectItem);