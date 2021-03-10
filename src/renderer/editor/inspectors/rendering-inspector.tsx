import * as React from "react";

import { Scene, DepthOfFieldEffectBlurLevel } from "babylonjs";

import { Inspector, IObjectInspectorProps } from "../components/inspector";

import { InspectorList } from "../gui/inspector/list";
import { InspectorNumber } from "../gui/inspector/number";
import { InspectorSection } from "../gui/inspector/section";
import { InspectorBoolean } from "../gui/inspector/boolean";
import { InspectorVector2 } from "../gui/inspector/vector2";

import { SceneSettings } from "../scene/settings";

import { AbstractInspector } from "./abstract-inspector";

export interface IRendererInspectorState {
    /**
     * Defines wether or not SSAO 2 is enabled.
     */
    ssao2Enabled: boolean;
    /**
     * Defines wether or not Motion Blur is enabled.
     */
    motionBlurEnabled: boolean;
    /**
     * Defines wether or not SSR is enabled.
     */
    ssrEnabled: boolean;
    /**
     * Defines the configuration of the default pipleine.
     */
    default: {
        /**
         * Defines wether or not the default rendering pipleine is enabled.
         */
        enabled: boolean;
        /**
         * Defines wether or not image processing is enabled.
         */
        imageProcessingEnabled: boolean;
        /**
         * Defines wether or not bloom is enabled
         */
        bloomEnabled: boolean;
        /**
         * Defines wether or not sharpen is enabled.
         */
        sharpenEnabled: boolean;
        /**
         * Defines wether or not DOF is enabled.
         */
        depthOfFieldEnabled: boolean;
        /**
         * Defines wether or not Chromatic Aberration is enabled.
         */
        chromaticAberrationEnabled: boolean;
    };
}

export class RenderingInspector extends AbstractInspector<Scene, IRendererInspectorState> {
    /**
     * Constructor.
     * @param props defines the component's props.
     */
     public constructor(props: IObjectInspectorProps) {
        super(props);

        this.state = {
            ssao2Enabled: SceneSettings.IsSSAOEnabled(),
            motionBlurEnabled: SceneSettings.IsMotionBlurEnabled(),
            ssrEnabled: SceneSettings.IsScreenSpaceReflectionsEnabled(),
            default: this._getDefaultState(),
        };
    }

    /**
     * Renders the content of the inspector.
     */
    public renderContent(): React.ReactNode {
        return (
            <>
                {this._getSSAO2Inspector()}
                {this._getMotionBlurInspector()}
                {this._getSSRInspector()}
                {this._getDefaultInspector()}
            </>
        );
    }

    /**
     * Returns the SSAO2 inspector used to configure the SSAO 2 post-process.
     */
    private _getSSAO2Inspector(): React.ReactNode {
        const enable = <InspectorBoolean object={this.state} property="ssao2Enabled" label="Enabled" onChange={(v) => {
            SceneSettings.SetSSAOEnabled(this.editor, this.state.ssao2Enabled);
            this.setState({ ssao2Enabled: v });
        }} />

        if (!this.state.ssao2Enabled || !SceneSettings.SSAOPipeline) {
            return (
                <InspectorSection title="SSAO 2">
                    {enable}
                </InspectorSection>
            );
        }

        return (
            <InspectorSection title="SSAO 2">
                {enable}
                <InspectorNumber object={SceneSettings.SSAOPipeline} property="radius" label="Radius" step={0.01} />
                <InspectorNumber object={SceneSettings.SSAOPipeline} property="totalStrength" label="Strength" step={0.01} />
                <InspectorNumber object={SceneSettings.SSAOPipeline} property="samples" label="Samples" step={1} min={1} max={32} />
                <InspectorNumber object={SceneSettings.SSAOPipeline} property="maxZ" label="Max Z" step={0.01} />
                <InspectorBoolean object={SceneSettings.SSAOPipeline} property="expensiveBlur" label="Expansive Blur"/>
            </InspectorSection>
        );
    }

    /**
     * Returns the Motion Blur inspector used to configure the Motion Blur post-process.
     */
    private _getMotionBlurInspector(): React.ReactNode {
        const enable = <InspectorBoolean object={this.state} property="motionBlurEnabled" label="Enabled" onChange={(v) => {
            SceneSettings.SetMotionBlurEnabled(this.editor, this.state.motionBlurEnabled);
            this.setState({ motionBlurEnabled: v });
        }} />

        if (!this.state.motionBlurEnabled || !SceneSettings.MotionBlurPostProcess) {
            return (
                <InspectorSection title="Motion Blur">
                    {enable}
                </InspectorSection>
            );
        }

        return (
            <InspectorSection title="Motion Blur">
                {enable}
                <InspectorNumber object={SceneSettings.MotionBlurPostProcess} property="motionStrength" label="Strength" step={0.01} />
                <InspectorNumber object={SceneSettings.MotionBlurPostProcess} property="motionBlurSamples" label="Samples" step={1} min={1} max={64} />
                <InspectorBoolean object={SceneSettings.MotionBlurPostProcess} property="isObjectBased" label="Object Based"/>
            </InspectorSection>
        );
    }

    /**
     * Returns the SSE inspector used to configure the Screen-Space-Reflections post-process.
     */
    private _getSSRInspector(): React.ReactNode {
        const enable = <InspectorBoolean object={this.state} property="ssrEnabled" label="Enabled" onChange={(v) => {
            SceneSettings.SetScreenSpaceReflectionsEnabled(this.editor, this.state.ssrEnabled);
            this.setState({ ssrEnabled: v });
        }} />

        if (!this.state.ssrEnabled || !SceneSettings.ScreenSpaceReflectionsPostProcess) {
            return (
                <InspectorSection title="Screen Space Reflections">
                    {enable}
                </InspectorSection>
            );
        }

        return (
            <InspectorSection title="Screen Space Reflections">
                {enable}

                <InspectorNumber object={SceneSettings.ScreenSpaceReflectionsPostProcess} property="strength" label="Strength" step={0.01} />
                <InspectorNumber object={SceneSettings.ScreenSpaceReflectionsPostProcess} property="threshold" label="Threshold" step={0.01} />
                <InspectorNumber object={SceneSettings.ScreenSpaceReflectionsPostProcess} property="step" label="Step" step={0.001} />
                <InspectorNumber object={SceneSettings.ScreenSpaceReflectionsPostProcess} property="reflectionSpecularFalloffExponent" label="Specular Exponent" step={0.001} />
                <InspectorNumber object={SceneSettings.ScreenSpaceReflectionsPostProcess} property="reflectionSamples" label="Samples" step={1} min={1} max={512} />
                <InspectorNumber object={SceneSettings.ScreenSpaceReflectionsPostProcess} property="roughnessFactor" label="Roughness Factor" step={0.01} min={0} max={10} />

                <InspectorSection title="Smooth">
                    <InspectorBoolean object={SceneSettings.ScreenSpaceReflectionsPostProcess} property="enableSmoothReflections" label="Enable" />
                    <InspectorNumber object={SceneSettings.ScreenSpaceReflectionsPostProcess} property="smoothSteps" label="Steps" step={1} min={0} max={32} />
                </InspectorSection>
            </InspectorSection>
        );
    }

    /**
     * Returns the default inspector used to configure the default rendering pipleline of Babylon.JS.
     */
    private _getDefaultInspector(): React.ReactNode {
        const enable = <InspectorBoolean object={this.state.default} property="enabled" label="Enabled" onChange={() => {
            SceneSettings.SetDefaultPipelineEnabled(this.editor, this.state.default.enabled);
            this._updateDefaultState();
        }} />

        if (!this.state.default.enabled || !SceneSettings.DefaultPipeline) {
            return (
                <InspectorSection title="Default Pipeline">
                    {enable}
                </InspectorSection>
            );
        }

        const imageProcessingEnable = <InspectorBoolean object={SceneSettings.DefaultPipeline} property="imageProcessingEnabled" label="Enabled" onChange={() => this._updateDefaultState()} />;
        const imageProcessing = this.state.default.imageProcessingEnabled ? (
            <InspectorSection title="Image Processing">
                {imageProcessingEnable}
                <InspectorNumber object={SceneSettings.DefaultPipeline.imageProcessing} property="exposure" label="Exposure" step={0.01} />
                <InspectorNumber object={SceneSettings.DefaultPipeline.imageProcessing} property="contrast" label="Contrast" step={0.01} />
                <InspectorBoolean object={SceneSettings.DefaultPipeline.imageProcessing} property="toneMappingEnabled" label="Tone Mapping Enabled" />
                <InspectorBoolean object={SceneSettings.DefaultPipeline.imageProcessing} property="fromLinearSpace" label="From Linear Space" />
            </InspectorSection>
        ) : (
            <InspectorSection title="Image Processing">
                {imageProcessingEnable}
            </InspectorSection>
        );

        const bloomEnable = <InspectorBoolean object={SceneSettings.DefaultPipeline} property="bloomEnabled" label="Enabled" onChange={() => this._updateDefaultState()} />;
        const bloom = this.state.default.bloomEnabled ? (
            <InspectorSection title="Bloom">
                {bloomEnable}
                <InspectorNumber object={SceneSettings.DefaultPipeline} property="bloomKernel" label="Kernel" step={1} min={1} max={512} />
                <InspectorNumber object={SceneSettings.DefaultPipeline} property="bloomWeight" label="Weight" step={0.01} min={0} max={1} />
                <InspectorNumber object={SceneSettings.DefaultPipeline} property="bloomThreshold" label="Threshold" step={0.01} min={0} max={1} />
                <InspectorNumber object={SceneSettings.DefaultPipeline} property="bloomScale" label="Scale" step={0.01} min={0} max={1} />
            </InspectorSection>
        ) : (
            <InspectorSection title="Bloom">
                {bloomEnable}
            </InspectorSection>
        );

        const sharpenEnable = <InspectorBoolean object={SceneSettings.DefaultPipeline} property="sharpenEnabled" label="Enabled" onChange={() => this._updateDefaultState()} />;
        const sharpen = this.state.default.sharpenEnabled ? (
            <InspectorSection title="Sharpen">
                {sharpenEnable}
                <InspectorNumber object={SceneSettings.DefaultPipeline.sharpen} property="edgeAmount" label="Edge Amount" step={0.01} min={0} max={2} />
                <InspectorNumber object={SceneSettings.DefaultPipeline.sharpen} property="colorAmount" label="Color Amount" step={0.01} min={0} max={2} />
            </InspectorSection>
        ) : (
            <InspectorSection title="Sharpen">
                {sharpenEnable}
            </InspectorSection>
        );

        const depthOfFieldEnable = <InspectorBoolean object={SceneSettings.DefaultPipeline} property="depthOfFieldEnabled" label="Enabled" onChange={() => this._updateDefaultState()} />;
        const depthOfField = this.state.default.depthOfFieldEnabled ? (
            <InspectorSection title="Depth Of Field">
                {depthOfFieldEnable}
                <InspectorNumber object={SceneSettings.DefaultPipeline.depthOfField} property="focusDistance" label="Focus Distance" step={1} min={0} />
                <InspectorNumber object={SceneSettings.DefaultPipeline.depthOfField} property="fStop" label="F-Stop" step={0.01} min={0} />
                <InspectorNumber object={SceneSettings.DefaultPipeline.depthOfField} property="focalLength" label="Focal Length" step={0.01} min={0} />

                <InspectorList object={SceneSettings.DefaultPipeline} property="depthOfFieldBlurLevel" label="Blur Level" items={[
                    { label: "Low", data: DepthOfFieldEffectBlurLevel.Low },
                    { label: "Medium", data: DepthOfFieldEffectBlurLevel.Medium },
                    { label: "High", data: DepthOfFieldEffectBlurLevel.High },
                ]} onChange={() => {
                    this.forceUpdate();
                }} />
            </InspectorSection>
        ) : (
            <InspectorSection title="Depth Of Field">
                {depthOfFieldEnable}
            </InspectorSection>
        );

       const chromaticAberrationEnable = <InspectorBoolean object={SceneSettings.DefaultPipeline} property="chromaticAberrationEnabled" label="Enabled" onChange={() => this._updateDefaultState()} />;
       const chromaticAberraction = this.state.default.chromaticAberrationEnabled ? (
            <InspectorSection title="Chromatic Aberration">
                {chromaticAberrationEnable}
                <InspectorNumber object={SceneSettings.DefaultPipeline.chromaticAberration} property="aberrationAmount" label="Amount" step={0.01} />
                <InspectorNumber object={SceneSettings.DefaultPipeline.chromaticAberration} property="radialIntensity" label="Radial Intensity" step={0.01} />
                <InspectorVector2 object={SceneSettings.DefaultPipeline.chromaticAberration} property="direction" label="Direction" step={0.01} />
                <InspectorVector2 object={SceneSettings.DefaultPipeline.chromaticAberration} property="centerPosition" label="Center" step={0.01} />
            </InspectorSection>
       ) : (
            <InspectorSection title="Chromatic Aberration">
                {chromaticAberrationEnable}
            </InspectorSection>
       );

        return (
            <InspectorSection title="Default Pipeline">
                {enable}

                <InspectorSection title="Anti Aliasing">
                    <InspectorBoolean object={SceneSettings.DefaultPipeline} property="fxaaEnabled" label="FXAA Enabled" />
                    <InspectorNumber object={SceneSettings.DefaultPipeline} property="samples" label="Samples" step={1} min={1} max={32} />
                </InspectorSection>

                {imageProcessing}
                {bloom}
                {sharpen}
                {depthOfField}
                {chromaticAberraction}
            </InspectorSection>
        );
    }

    /**
     * Returns the new state of the default pipeline.
     */
    private _getDefaultState(): IRendererInspectorState["default"] {
        return {
            enabled: SceneSettings.IsDefaultPipelineEnabled(),
            imageProcessingEnabled: SceneSettings.DefaultPipeline?.imageProcessingEnabled ?? false,
            bloomEnabled: SceneSettings.DefaultPipeline?.bloomEnabled ?? false,
            sharpenEnabled: SceneSettings.DefaultPipeline?.sharpenEnabled ?? false,
            depthOfFieldEnabled: SceneSettings.DefaultPipeline?.depthOfFieldEnabled ?? false,
            chromaticAberrationEnabled: SceneSettings.DefaultPipeline?.chromaticAberrationEnabled ?? false,
        }
    }
    
    /**
     * Updates the default rendering pipeline state.
     */
    private _updateDefaultState(): void {
        this.setState({
            default: {
                ...this.state.default,
                ...this._getDefaultState(),
            },
        });
    }
}

Inspector.RegisterObjectInspector({
    ctor: RenderingInspector,
    ctorNames: ["Scene"],
    title: "Rendering",
});